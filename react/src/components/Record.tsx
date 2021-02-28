import React, { createRef, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ru from 'date-fns/locale/ru'
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { IRecord } from '../models/Record';
import { IDoctor } from '../models/Doctor';
import { dateTimeToString, dateToString } from '../utils/utils'
import { addressServer } from '../config/config'

export interface Props {
}

interface State {
    patientFirstName?: string;
    patientLastName?: string;
    patientMiddleName?: string;
    complaints?: string;
    doctors: IDoctor[];
    startDate?: any;
    currentDoctorId?: string;
    includeDates: any[];
    includeTimes: any[];

    //alert
    alertVariant?: string;
    alertText?: string;
    alertVisible: boolean;
}

class Record extends React.Component<Props, State> {
    _datePicker?: React.RefObject<DatePicker>;

    showAlert(variant: string, text: string) {
        this.setState(({
            alertVisible: true,
            alertText: text,
            alertVariant: variant
        }))
        window.setTimeout(() => {
            this.setState({ alertVisible: false })
        }, 4000)
    }

    componentDidMount() {
        fetch(addressServer + '/api/record/getDoctors')
            .then(responce => responce.json())
            .then((responce: IDoctor[]) => {
                this.setState((prevState) => (
                    {
                        currentDoctorId: responce && responce.length > 0 ? "1" : undefined,
                        doctors: responce
                    }
                ))
            })
            .catch(() => console.log('getDoctors method throw exception.'))

    }

    constructor(props: Props) {
        super(props);
        registerLocale("ru", ru);
        this._datePicker = React.createRef();
        this.state = {
            doctors: [],
            patientFirstName: '',
            patientLastName: '',
            patientMiddleName: '',
            currentDoctorId: undefined,
            startDate: null,
            includeDates: [new Date(2021, 1, 3), new Date(2021, 2, 1)],
            includeTimes: [],
            alertVisible: false,
            alertVariant: 'success',
            alertText: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    changeDatePicker(date = this.state.startDate) {
        if(!date)
            return;
        let doctorIdAndDateTime: { doctorId?: string, date: string } = { doctorId: this.state.currentDoctorId, date: dateToString(date) };
        let setOnlyDate: boolean = dateTimeToString(date).slice(11, 13) === '24'
            || dateTimeToString(date).slice(11, 13) === '00';
        if (setOnlyDate) {
            fetch(addressServer + '/api/record/getFreeDateTimeForDate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(doctorIdAndDateTime)
            })
                .then(responce => responce.json())
                .then((responce: string[]) => {
                    this.setState({ includeTimes: responce.map(elem => new Date(elem)) })
                })
                .catch(() => {
                    this.showAlert('danger', 'Ошибка получения времени')
                })
        }
        this.setState((prevState) => (
            {
                startDate: date
            }
        ))
    }

    customDatePicker() {
        return <DatePicker
            id="datePicker"
            ref={this._datePicker}
            locale="ru"
            timeCaption="Время"
            inline
            showTimeSelect
            selected={this.state.startDate}
            timeIntervals={30}
            minDate={new Date()}
            onChange={date => {
                this.changeDatePicker(date)
            }}
            includeTimes={this.state.includeTimes} />;
    }

    render() {
        return (
            <div className="Record">
                <Alert variant={this.state.alertVariant} show={this.state.alertVisible}>
                    <Alert.Heading>{this.state.alertText}</Alert.Heading>
                </Alert>
                <Container>
                    <Form onSubmit={this.handleSubmit} >

                        <Form.Label style={{ paddingTop: 10 }}>ФИО пациента:</Form.Label>
                        <Row >

                            <Col xs={12} md={12} lg={4} xl={4} style={{ paddingBottom: 10 }}>
                                <Form.Control required type="text"
                                    value={this.state.patientFirstName}
                                    onChange={e => this.setState({ patientFirstName: e.target.value })}
                                    placeholder="Ваше имя" />
                            </Col>


                            <Col xs={12} md={12} lg={4} style={{ paddingBottom: 10 }}>
                                <Form.Control required type="text"
                                    value={this.state.patientLastName}
                                    onChange={e => this.setState({ patientLastName: e.target.value })}
                                    placeholder="Ваша фамилия" />
                            </Col>


                            <Col xs={12} md={12} lg={4} style={{ paddingBottom: 10 }}>
                                <Form.Control required type="text"
                                    value={this.state.patientMiddleName}
                                    onChange={e => this.setState({ patientMiddleName: e.target.value })}
                                    placeholder="Ваше отчество" />
                            </Col>

                        </Row>


                        <Form.Group controlId="formDoctor" >
                            <Form.Label >Доктор:</Form.Label>
                            <Form.Control
                                required as="select"
                                onChange={e => this.setState({ currentDoctorId: e.target.value }, this.changeDatePicker)}
                            >
                                {this.state.doctors.map(element => {
                                    return <option key={element.id} value={element.id}>{element.name}</option>
                                })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formRecordDate">
                            <Col>
                                <Row>
                                    <Form.Label>Время записи:</Form.Label>
                                </Row>
                                <Row>
                                    {this.customDatePicker()}
                                </Row>
                            </Col>
                        </Form.Group>

                        <Form.Group controlId="formComplaints">
                            <Form.Label>Жалобы:</Form.Label>
                            <Form.Control as="textarea"
                                value={this.state.complaints}
                                onChange={e => this.setState({ complaints: e.target.value })}
                                placeholder="Введите свои жалобы" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Записаться
                        </Button>
                    </Form>
                </Container>
            </div>
        );
    }

    async handleSubmit() {
        if (this.state.startDate === null
            || dateTimeToString(this.state.startDate).slice(11, 13) == '00'
            || dateTimeToString(this.state.startDate).slice(11, 13) == '24') {
            if (this._datePicker !== null) {
                this._datePicker?.current?.setFocus();
            }
        } else if (this.state.currentDoctorId) {
            let newRecord: IRecord = {
                pFirstName: this.state.patientFirstName,
                pLastName: this.state.patientLastName,
                pMiddleName: this.state.patientMiddleName,
                doctorId: this.state.currentDoctorId,
                complaints: this.state.complaints,
                recordDate: dateTimeToString(this.state.startDate)
            };
            console.log(newRecord)
            fetch(addressServer + '/api/record/addRecord', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(newRecord)
            })
                .then(responce => {
                    if (responce.status === 201) {
                        this.showAlert('success', 'Сохранено')
                    } else {
                        this.showAlert('danger', 'Ошибка сохранения')
                    }
                })
                .catch(() => {
                    this.showAlert('danger', 'Ошибка сохранения')
                })
        }
    }
}

export default Record;
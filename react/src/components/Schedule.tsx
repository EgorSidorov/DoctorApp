import React from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { IDoctor } from '../models/Doctor';
import DatePicker, { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru'
import { dateTimeToString, dateToString } from '../utils/utils'
import { addressServer } from '../config/config'

export interface Props {
}

interface IDoctorPatientSchedule {
  scheduleId: string,
  doctor: string,
  patient: string,
  recordDate: string,
  complaints?: string
}

interface State {
  schedule: IDoctorPatientSchedule[]
  currentDoctorId?: string;
  doctors: IDoctor[];
  startDate?: any;
}

class Schedule extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    registerLocale("ru", ru);
    this.columns = [
      'Доктор',
      'Пациент',
      'Дата и время записи',
      'Жалобы',
      ''];
    this.state = {
      schedule: [],
      doctors: [],
      currentDoctorId: undefined,
      //startDate: undefined'2021-02-28'
    };
  }

  loadSchedule() {
    let doctorIdAndDateTime: { doctorId?: string, date?: string } = { doctorId: this.state.currentDoctorId, date: this.state.startDate ? dateToString(this.state.startDate) : undefined };
    if (!doctorIdAndDateTime.date || !doctorIdAndDateTime.doctorId)
      return;
    fetch(addressServer + '/api/schedule/selectSchedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(doctorIdAndDateTime)
    })
      .then(responce => responce.json())
      .then((responce: IDoctorPatientSchedule[]) => {
        this.setState({ schedule: responce })
      })
      .catch(() => {
        console.log("error load schedule")
      })
  }

  componentDidMount() {
    fetch(addressServer + '/api/record/getDoctors')
      .then(responce => responce.json())
      .then((responce: IDoctor[]) => {
        this.setState({
          currentDoctorId: responce && responce.length > 0 ? "1" : undefined,
          doctors: responce
        }, this.loadSchedule)
      })
      .catch(() => console.log('getDoctors method throw exception.'))
  }

  columns: string[];
  _datePicker?: React.RefObject<DatePicker>;

  customDatePicker() {
    return <DatePicker
      id="datePicker"
      ref={this._datePicker}
      locale="ru"
      inline
      selected={this.state.startDate}
      onChange={date => this.setState({ startDate: date }, this.loadSchedule)}
    />;
  }

  render() {
    return (
      <div className="Schedule">
        <Container style={{ paddingTop: 20 }}>

          <Form.Group controlId="formDoctor" >
            <Form.Control
              required as="select"
              onChange={e => {
                this.setState({ currentDoctorId: e.target.value },
                  this.loadSchedule)
              }}
            >
              {this.state.doctors.map(element => {
                return <option key={element.id} value={element.id}>{element.name}</option>
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formRecordDate">
            {this.customDatePicker()}
          </Form.Group>

          <Table striped bordered hover>
            <thead>
              <tr>
                {this.columns.map(element => {
                  return <th>{element}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {this.state.schedule.map(element => {
                return <tr>
                  <td key={element.scheduleId + '_1'}>{element.doctor}</td>
                  <td key={element.scheduleId + '_2'}>{element.patient}</td>
                  <td key={element.scheduleId + '_3'}>{element.recordDate}</td>
                  <td key={element.scheduleId + '_4'}>{element.complaints}</td>
                  <td key={element.scheduleId + '_5'} style={{ width: '55px' }}>
                    <Button key={element.scheduleId + '_delete_button'} variant="danger" onClick={() => {
                      fetch(addressServer + '/api/schedule/removeSchedule/?scheduleId=' + element.scheduleId, {
                        method: 'DELETE'
                      })
                        .then(responce => {
                          if (responce.status == 202) {
                            this.loadSchedule()
                          }
                        })
                        .catch(() => {
                          console.log("error remove schedule")
                        })
                    }}>X</Button>
                  </td>
                </tr>
              })}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default Schedule;
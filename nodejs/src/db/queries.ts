export const selectAllDoctorsQuery : String = "SELECT d.id, CONCAT(d.lastName, CONCAT(' ',CONCAT(d.firstName, CONCAT(' ', d.middleName)))) as name FROM doctors d";
export const selectScheduleQuery : String = "SELECT sc.id as scheduleId"
+ ", CONCAT(d.lastName, CONCAT(' ',CONCAT(d.firstName, CONCAT(' ', d.middleName)))) as doctor" 
+ ", CONCAT(p.lastName, CONCAT(' ',CONCAT(p.firstName, CONCAT(' ', p.middleName)))) as patient" 
+ ", sc.recordDate as recordDate" 
+ ", sc.complaints as complaints"
+ " FROM schedule sc"
+ " JOIN doctors d ON d.id = sc.doctor_id"
+ " JOIN patients p ON p.id = sc.patient_id"
+ " WHERE d.id = ? AND cast(sc.recordDate as date) = ?";
export const removeScheduleQuery : String = "DELETE FROM schedule where id = ?"
export const addPatientQuery : String = "INSERT INTO patients (firstName, lastName, middleName) VALUES(?,?,?)"
export const addScheduleQuery : String = "INSERT INTO schedule (doctor_id, patient_id, complaints, recordDate) VALUES(?,?,?,?)"
export const selectBusyTimeForDate : String = "SELECT DISTINCT recordDate from schedule WHERE doctor_id = ? and cast(recordDate as date) = ?"

module.exports = {selectAllDoctorsQuery, selectScheduleQuery, removeScheduleQuery, addPatientQuery, addScheduleQuery, selectBusyTimeForDate};
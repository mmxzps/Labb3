import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function () {

    const [bookingTime, setBookingTime] = useState("")
    const [amountGuests, setAmountGuests] = useState(0)
    const [availableTables, setAvailableTables] = useState([])
    const [pickedTable, setPickedTable] = useState(null)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState(0)
    const [finishedBooking, setFinishedbooking] = useState(null)



    async function FindTables(e) {
        e.preventDefault();
        const searchTablePrams = { params: { startTime: bookingTime, amountGuests } }
        var apiResp = await axios.get('https://localhost:7056/api/Tables/ShowFreeTables', searchTablePrams)
        console.log(apiResp)
        setAvailableTables(apiResp.data);
    }

    function ShowPickedInfo() {
        const infos = { bookingTime, amountGuests }
    }

    async function FinishBooking(e) {
        e.preventDefault();
        var bookTableData = { firstName, lastName, phoneNumber, amountGuest: amountGuests, bookingTime: bookingTime, tableId: pickedTable }
        try {
            var resp = await axios.post('https://localhost:7056/api/Bookings/AddBooking', bookTableData)
            console.log(resp)
            if (resp.status === 204) {
                setFinishedbooking(
                    {
                        firstName,
                        lastName,
                        phoneNumber,
                        amountGuests,
                        bookingTime,
                        pickedTable
                    })
            }

        } catch (error) {
            console.log(resp)
            console.log(error)
        }
    }

    return (
        <>
            {/*välja datum*/}
            <h5>Enter date and amount of persons</h5>
            <form onSubmit={FindTables}>
                <label htmlFor="datum">Date:</label>
                <input className="m-2" type='datetime-local' id="datum" value={bookingTime} onChange={e => setBookingTime(e.target.value)} required />

                <label htmlFor="antalPers">Guests:</label>
                <select onChange={(e) => setAmountGuests(parseInt(e.target.value))} value={amountGuests} type='number' className="m-2" name="" id="antalPers" >
                    <option value="">Amount person:</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                </select>

                <button className="btn btn-outline-primary btn-sm m-2" type="submit">Search</button>
            </form>

            {/*se bord*/}
            {/*välj bord*/}
            <br />
            <hr />
            <h3>Available tables</h3>
            {availableTables.map((t) => (
                <div key={t.id}>
                    <li>Number: {t.tableNumber} Seats: {t.tableSeats}</li>
                    <button type="submit" className="btn btn-outline-primary btn-sm" onClick={() => setPickedTable(t.id)}>Choose table</button>
                </div>
            ))}



            {/*boka bord*/}
            <br />
            <hr />
            {pickedTable && (<div>
                <h3>Book table {pickedTable}</h3>
                <form onSubmit={FinishBooking}>
                    <label htmlFor="firstName">First name</label>
                    <input type="text" name="" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} />

                    <label htmlFor="lastName">Last name</label>
                    <input type="text" name="" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />

                    <label htmlFor="phoneNumber">phoneNumber</label>
                    <input type="text" name="" id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />

                    <button type="submit" className="btn btn-outline-primary btn-sm">Book</button>
                </form>

            </div>)}


            {finishedBooking && (
                <div className="alert alert-success mt-4">
                    <p>Booking Summary:</p>
                    <p>{firstName} {lastName}</p>
                    <p>{phoneNumber}</p>
                    <p>Booking Time: {bookingTime}</p>
                    <p>Table: {pickedTable}</p>

                </div>
            )}
        </>
    )
}
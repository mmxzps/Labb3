import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddBooking() {
    const [datee, setDatee] = useState("");
    const [guests, setGuests] = useState(1);
    const [availableTables, setAvailableTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [customerLastName, setCustomerLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [bookedTableDetails, setBookedTableDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [searched, setSearched] = useState(false);

    const searchTables = async (e) => {
        e.preventDefault();
        setSearched(true);

        if (!datee || !guests) {
            alert("Please enter both date and number of guests.");
            return;
        }

        try {
            const customerInput = { params: { startTime: datee, amountGuests: guests } };
            const response = await axios.get('https://localhost:7056/api/Tables/ShowFreeTables', customerInput);
            setAvailableTables(response.data);
        } catch (error) {
            console.error("Error fetching free tables", error);
            setErrorMessage("Error fetching available tables! Please try again.");
        }
    };

    const bookTable = async (e) => {
        e.preventDefault();

        if (!datee || !guests || !selectedTable || !customerName || !customerLastName || !phoneNumber) {
            alert("Fill all the fields!");
            return;
        }

        try {
            const bookingData = { firstName: customerName, lastName: customerLastName, phoneNumber: phoneNumber, amountGuest: guests, bookingTime: datee, tableId: selectedTable };
            const response = await axios.post('https://localhost:7056/api/Bookings/AddBooking', bookingData);

            if (response.status === 204) {
                setBookedTableDetails({
                    tableId: selectedTable,
                    customerName,
                    customerLastName,
                    phoneNumber,
                    guests,
                    bookingTime: datee,
                });
            } else {
                setErrorMessage("Failed to book table! Please try again.");
            }

        } catch (error) {
            console.error("Error booking table", error);
            setErrorMessage("An error occurred while booking the table! Please try again.");
        }
    };

    // resetting values which will show
    const resetBooking = () => {
        setDatee("");
        setGuests(1);
        setAvailableTables([]);
        setSelectedTable(null);
        setCustomerName("");
        setCustomerLastName("");
        setPhoneNumber("");
        setBookedTableDetails(null);
        setErrorMessage("");
    };

    return (
        <>
            {/* shows the forms as long as booking is not set.(conditional rendering) */}
            {!bookedTableDetails && (
                <>
                    {/* Shows the form when table if not table is chosen. (ternary operator ) */}
                    {!selectedTable ? (
                        <>
                            <h4>-Enter date- </h4>
                            <form onSubmit={searchTables}>
                                <label htmlFor="date">Chose date:</label>
                                <input
                                    onChange={(e) => setDatee(e.target.value)}
                                    value={datee} type="datetime-local" step="900" id="date" className="form-control"
                                    onFocus={(e) => e.target.showPicker()}
                                />

                                <label htmlFor="guests">Amount of guests:</label>
                                <select onChange={(e) => setGuests(parseInt(e.target.value))} value={guests} type="number" id="guests" className="form-control">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                </select>

                                <button type="submit" className="btn btn-outline-primary btn-sm m-4">Search</button>
                            </form>
                        </>
                    ) : (
                        // Showing short info when table is chosen.
                        <div className="mt-4">
                            <p><strong>Date:</strong> {new Date(datee).toLocaleString('sv-SE', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                            <p><strong>Number of guests:</strong> {guests}</p>
                            <p><strong>Table:</strong> {selectedTable}</p>
                        </div>
                    )}

                    {/*If no tables are available */}
                    {searched && availableTables.length == 0 && datee && (<div className="alert alert-danger"><p>Couldn't find free tables. Try another date!</p></div>)}


                    {/* show tables if no table is chosen & availableTables have data (conditional rendering)*/}
                    {!selectedTable && availableTables.length > 0 && (
                        <div>
                            <h2>Available Tables</h2>
                            <ul>
                                {availableTables.map((table) => (
                                    <div key={table.id}>
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col"></th>
                                                    <th scope="col">Table number</th>
                                                    <th scope="col">Table seats</th>
                                                    <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Table {table.tableNumber}</td>
                                                    <td>Seats {table.tableSeats}</td>
                                                    <td>
                                                        <button type="button" className="btn btn-outline-primary btn-sm m-2"
                                                            onClick={() => setSelectedTable(table.id)}>Select</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Shows form to fill info only when table is selected. (conditional rendering)*/}
                    {selectedTable && (
                        <div>
                            <h2>Enter your details</h2>

                            <form onSubmit={bookTable}>
                                <label htmlFor="name">First Name:</label>
                                <input type="text" id="name" className="form-control" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />

                                <label htmlFor="lastName">Last Name:</label>
                                <input type="text" id="lastName" className="form-control" value={customerLastName} onChange={(e) => setCustomerLastName(e.target.value)} required />

                                <label htmlFor="phone">Phone Number:</label>
                                <input maxLength="10" type="tel" id="phone" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />

                                <button type="submit" className="btn btn-success btn-sm m-4">Book table</button>
                                {/*make new booking possible by resetting all values.*/}
                                <button onClick={resetBooking} className="btn btn-outline-secondary btn-sm m-4">
                                    Start over
                                </button>
                            </form>
                        </div>
                    )}

                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                </>
            )}

            {/* show bookingSummary when bookedSummary is set. (conditional rendering) */}
            {bookedTableDetails && (
                <div className="alert alert-success mt-4">
                    <h3>Booking Confirmed!</h3>
                    <p><strong>Table:</strong> {bookedTableDetails.tableId}</p>
                    <p><strong>Name:</strong> {bookedTableDetails.customerName} {bookedTableDetails.customerLastName}</p>
                    <p><strong>Phone Number:</strong> {bookedTableDetails.phoneNumber}</p>
                    <p><strong>Guests:</strong> {bookedTableDetails.guests}</p>
                    <p><strong>Booking Time:</strong> {bookedTableDetails.bookingTime}</p>

                    {/*make new booking possible by resetting all values.*/}
                    <button onClick={resetBooking} className="btn btn-primary mt-3">
                        Book another table
                    </button>
                </div>
            )}
        </>
    );
}

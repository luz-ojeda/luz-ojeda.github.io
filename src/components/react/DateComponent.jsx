import { useEffect, useState } from "react";
import useDebouncedValue from "./useDebouncedValue";

export default function DateComponent() {
	const [invalidDate, setInvalidDate] = useState(false);

	const [date, setDate] = useState(new Date());
	const [dateString, setDateString] = useState("");
	const [timeString, setTimeString] = useState("");
	const debouncedDate = useDebouncedValue(dateString, 700);
	const debouncedTime = useDebouncedValue(timeString, 700);

	const handleDateChange = e => {
		setDateString(e.target.value);
	};

	const handleTimeChange = e => {
		setTimeString(e.target.value);
	};

	useEffect(() => {
		if (debouncedDate) {
			setInvalidDate(false);

			let newDate;
			if (debouncedTime) {
				newDate = new Date(`${debouncedDate}T${debouncedTime}`);
			} else {
				// Handle UNIX timestamps from input since they come as string
				if (!isNaN(Number(debouncedDate))) {
					newDate = new Date(parseInt(debouncedDate));
				} else {
					newDate = new Date(debouncedDate);
				}
			}

			if (!isNaN(newDate.valueOf())) {
				setDate(newDate);
			} else {
				setInvalidDate(true);
			}
		}
	}, [debouncedDate, debouncedTime]);

	return (
		<div>
			<input type="text" onInput={handleDateChange} />
			<div>
				<input type="date" onChange={handleDateChange} />
				<input type="time" step="1" onChange={handleTimeChange} />
				{invalidDate && (
					<p className="error">The date entered was invalid</p>
				)}
			</div>
			<h3 id="timestamp">Timestamp</h3>
			<div style={{ overflowX: "auto" }}>
				<table>
					<thead>
						<tr>
							<th>method</th>
							<th>output</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">getTime()</th>
							<td>{date.getTime()}</td>
							<td>
								milliseconds since 1970-01-01,
								negative if before that date
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h3 id="local-time">Local Time Methods</h3>
			<div style={{ overflowX: "auto" }}>
				<table>
					<thead>
						<tr>
							<th>method</th>
							<th>output</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">getDate()</th>
							<td>{date.getDate()}</td>
							<td>day of the month</td>
						</tr>
						<tr>
							<th scope="row">getDay()</th>
							<td>{date.getDay()}</td>
							<td>
								day of the week (0-6) where 0 is
								sunday
							</td>
						</tr>
						<tr>
							<th scope="row">getFullYear()</th>
							<td>{date.getFullYear()}</td>
							<td>four-digit year</td>
						</tr>
						<tr>
							<th scope="row">getMonth()</th>
							<td>{date.getMonth()}</td>
							<td>month (0-11)</td>
						</tr>
						<tr>
							<th scope="row">getHours()</th>
							<td>{date.getHours()}</td>
							<td>hour (0-23)</td>
						</tr>
						<tr>
							<th scope="row">getMinutes()</th>
							<td>{date.getMinutes()}</td>
							<td>minutes (0-59)</td>
						</tr>
						<tr>
							<th scope="row">getSeconds()</th>
							<td>{date.getSeconds()}</td>
							<td>seconds (0-59)</td>
						</tr>
						<tr>
							<th scope="row">getMilliseconds()</th>
							<td>{date.getMilliseconds()}</td>
							<td>milliseconds (0-999)</td>
						</tr>
						<tr>
							<th scope="row">getTimezoneOffset()</th>
							<td>{date.getTimezoneOffset()}</td>
							<td>
								difference between UTC timezone and
								local time in minutes
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h3 id="utc">UTC Methods</h3>
			<div style={{ overflowX: "auto" }}>
				<table>
					<thead>
						<tr>
							<th>method</th>
							<th>output</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">getUTCDate()</th>
							<td>{date.getUTCDate()}</td>
							<td>UTC day of the month</td>
						</tr>
						<tr>
							<th scope="row">getUTCDay()</th>
							<td>{date.getUTCDay()}</td>
							<td>UTC day of the week (0-6)</td>
						</tr>
						<tr>
							<th scope="row">getUTCFullYear()</th>
							<td>{date.getUTCFullYear()}</td>
							<td>UTC four-digit year</td>
						</tr>
						<tr>
							<th scope="row">getUTCHours()</th>
							<td>{date.getUTCHours()}</td>
							<td>UTC hour (0-23)</td>
						</tr>
						<tr>
							<th scope="row">getUTCMinutes()</th>
							<td>{date.getUTCMinutes()}</td>
							<td>UTC minutes (0-59)</td>
						</tr>
						<tr>
							<th scope="row">getUTCMonth()</th>
							<td>{date.getUTCMonth()}</td>
							<td>UTC month (0-11)</td>
						</tr>
						<tr>
							<th scope="row">getUTCSeconds()</th>
							<td>{date.getUTCSeconds()}</td>
							<td>UTC seconds (0-59)</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h3 id="formatting">Formatting</h3>
			<div style={{ overflowX: "auto" }}>
				<table>
					<thead>
						<tr>
							<th>method</th>
							<th>output</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">toDateString()</th>
							<td>{date.toDateString()}</td>
							<td></td>
						</tr>
						<tr>
							<th scope="row">toISOString()</th>
							<td>{date.toISOString()}</td>
							<td>
								simplified format based on{" "}
								<a href="https://en.wikipedia.org/wiki/ISO_8601">
									ISO 8601
								</a>
							</td>
						</tr>
						<tr>
							<th scope="row">toLocaleString()</th>
							<td>{date.toLocaleString()}</td>
							<td>
								language-sensitive representation of
								the date in the local timezone
							</td>
						</tr>
						<tr>
							<th scope="row">toLocaleDateString()</th>
							<td>{date.toLocaleDateString()}</td>
							<td>same as before only date</td>
						</tr>
						<tr>
							<th scope="row">toLocaleTimeString()</th>
							<td>{date.toLocaleTimeString()}</td>
							<td>same as before only time</td>
						</tr>
						<tr>
							<th scope="row">toTimeString()</th>
							<td>{date.toTimeString()}</td>
							<td>
								time portion of the date interpreted
								in the local timezone
							</td>
						</tr>
						<tr>
							<th scope="row">toUTCString()</th>
							<td>{date.toUTCString()}</td>
							<td>
								<a href="https://datatracker.ietf.org/doc/html/rfc7231#section-7.1.1.1">
									RFC 7231 format
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

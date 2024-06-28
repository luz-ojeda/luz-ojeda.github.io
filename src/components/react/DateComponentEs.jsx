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
                newDate = new Date(debouncedDate);
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
                {invalidDate && <p className="error">La fecha ingresada no es válida</p>}
            </div>
            <h3 id="timestamp">Marca de tiempo</h3>
            <table>
                <thead>
                    <tr>
                        <th>método</th>
                        <th>retorno</th>
                        <th>descripción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">getTime()</th>
                        <td>{date.getTime()}</td>
                        <td>milisegundos desde 1970-01-01</td>
                    </tr>
                </tbody>
            </table>
            <h3 id="local-time">Métodos de Hora Local</h3>
            <table>
                <thead>
                    <tr>
                        <th>método</th>
                        <th>retorno</th>
                        <th>descripción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">getDate()</th>
                        <td>{date.getDate()}</td>
                        <td>día del mes</td>
                    </tr>
                    <tr>
                        <th scope="row">getDay()</th>
                        <td>{date.getDay()}</td>
                        <td>día de la semana (0-6) donde 0 es domingo</td>
                    </tr>
                    <tr>
                        <th scope="row">getFullYear()</th>
                        <td>{date.getFullYear()}</td>
                        <td>año de cuatro dígitos</td>
                    </tr>
                    <tr>
                        <th scope="row">getMonth()</th>
                        <td>{date.getMonth()}</td>
                        <td>mes (0-11)</td>
                    </tr>
                    <tr>
                        <th scope="row">getHours()</th>
                        <td>{date.getHours()}</td>
                        <td>hora (0-23)</td>
                    </tr>
                    <tr>
                        <th scope="row">getMinutes()</th>
                        <td>{date.getMinutes()}</td>
                        <td>minutos (0-59)</td>
                    </tr>
                    <tr>
                        <th scope="row">getSeconds()</th>
                        <td>{date.getSeconds()}</td>
                        <td>segundos (0-59)</td>
                    </tr>
                    <tr>
                        <th scope="row">getMilliseconds()</th>
                        <td>{date.getMilliseconds()}</td>
                        <td>milisegundos (0-999)</td>
                    </tr>
                    <tr>
                        <th scope="row">getTimezoneOffset()</th>
                        <td>{date.getTimezoneOffset()}</td>
                        <td>diferencia entre la zona horaria UTC y la hora local en minutos</td>
                    </tr>
                </tbody>
            </table>

            <h3 id="utc">Métodos UTC</h3>
            <table>
                <thead>
                    <tr>
                        <th>método</th>
                        <th>retorno</th>
                        <th>descripción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">getUTCDate()</th>
                        <td>{date.getUTCDate()}</td>
                        <td>día UTC del mes</td>
                    </tr>
                    <tr>
                        <th scope="row">getUTCDay()</th>
                        <td>{date.getUTCDay()}</td>
                        <td>día UTC de la semana (0-6)</td>
                    </tr>
                    <tr>
                        <th scope="row">getUTCFullYear()</th>
                        <td>{date.getUTCFullYear()}</td>
                        <td>año UTC de cuatro dígitos</td>
                    </tr>
                    <tr>
                        <th scope="row">getUTCHours()</th>
                        <td>{date.getUTCHours()}</td>
                        <td>hora UTC (0-23)</td>
                    </tr>
                    <tr>
                        <th scope="row">getUTCMinutes()</th>
                        <td>{date.getUTCMinutes()}</td>
                        <td>minutos UTC (0-59)</td>
                    </tr>
                    <tr>
                        <th scope="row">getUTCMonth()</th>
                        <td>{date.getUTCMonth()}</td>
                        <td>mes UTC (0-11)</td>
                    </tr>
                    <tr>
                        <th scope="row">getUTCSeconds()</th>
                        <td>{date.getUTCSeconds()}</td>
                        <td>segundos UTC (0-59)</td>
                    </tr>
                </tbody>
            </table>

            <h3 id="formatting">Formatos</h3>
            <table>
                <thead>
                    <tr>
                        <th>método</th>
                        <th>retorno</th>
                        <th>descripción</th>
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
                            formato simplificado basado en <a href="https://es.wikipedia.org/wiki/ISO_8601">ISO 8601</a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">toLocaleString()</th>
                        <td>{date.toLocaleString()}</td>
                        <td>representación sensible al idioma de la fecha en la zona horaria local</td>
                    </tr>
                    <tr>
                        <th scope="row">toLocaleDateString()</th>
                        <td>{date.toLocaleDateString()}</td>
                        <td>igual que antes pero solo la fecha</td>
                    </tr>
                    <tr>
                        <th scope="row">toLocaleTimeString()</th>
                        <td>{date.toLocaleTimeString()}</td>
                        <td>igual que antes pero solo la hora</td>
                    </tr>
                    <tr>
                        <th scope="row">toTimeString()</th>
                        <td>{date.toTimeString()}</td>
                        <td>porción de tiempo de la fecha interpretada en la zona horaria local</td>
                    </tr>
                    <tr>
                        <th scope="row">toUTCString()</th>
                        <td>{date.toUTCString()}</td>
                        <td>
                            formato <a href="https://datatracker.ietf.org/doc/html/rfc7231#section-7.1.1.1">RFC 7231</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

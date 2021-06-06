import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Box from './Box';

// ich habe React Bootstrap für ein einfaches Layout verwendet
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

// ich habe mich hier für functional components entschieden, weil ich gerne mit React Hooks arbeite; natürlich hätte man hier auch eine class verwenden können, 
// aber durch die Hooks spart man das "this.state" und schreibt etwas kompakter
function Playground(props) {

    // die Raster-Größe kann durch diese Variable angepasst werden
    const gridSize = 5;

    // damit ich das Raster automatisiert mappen kann, habe ich leere Arrays für die Reihen und die Spalten angelegt
    const [gridRows, setGridRows] = useState([...Array(gridSize).keys()]);
    const [gridCols, setGridCols] = useState([...Array(gridSize).keys()]);

    // diese tmp-hooks verwende ich zur Zwischenspeicherung, damit ich die vorgegeben place-Funktion mit den 
    // geforderten Parametern umsetzen kann und eine Überprüfung der Werte vornehmen kann
    const [posXTMP, setPosXTMP] = useState(-1);
    const [posYTMP, setPosYTMP] = useState(-1);
    const [facingTMP, setFacingTMP] = useState('Nowhere');

    // diese hooks entsprechen der aktuellen Position des Robos
    const [posX, setPosX] = useState(-1);
    const [posY, setPosY] = useState(-1);
    const [facing, setFacing] = useState('Nowhere');

    // hier lege ich fest, welche Richtung zu welchem Wert gehört, das brauche ich später für die Funkionen left und right
    const direction = Object.freeze({
        "NORTH": 1,
        "WEST": 2,
        "SOUTH": 3,
        "EAST": 4
    });

    // diese Hooks nutze ich als Schalter, um das Error-Handling zu visualisieren bzw. die Report-Funktion an und aus zuschalten
    const [posError, setPosError] = useState(false);
    const [placeError, setPlaceError] = useState(false);
    const [facingError, setFacingError] = useState(false);
    const [reportOn, setReportOn] = useState(false);
    const [reportString, setReportString] = useState("on");

    // erst nach dem Patzieren des Robos können die anderen Funktionen verwendet werden
    const [robotIsNotPlaced, setRobotIsNotPlaced] = useState(true);
    const [interactRobot, setinteractRobot] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        place(posXTMP, posYTMP, facingTMP);
        // anstatt der place-Funktion könnte man auch einfach die Funktionalität dieser hier ausführen implementieren
        // if (Number.isInteger(setPosXTMP) && Number.isInteger(setPosYTMP) && setPosXTMP < 5 && setPosXTMP > -1 && setPosYTMP < 5 && setPosYTMP > -1) {....
    }

    const place = (x, y, f) => {
        // falls zuvor eine Fehler-Meldung bzgl der Position gezeigt wurde, wird diese vor der neuen Platzierung ausgeschaltet
        setPosError(false);
        let checkNumbers = false;
        let checkFacing = false;

        // zusätzliche überprüfung (im Formular werden die Werte bereits bei der Eingabe validiert), falls die Funktion separat aufgerufen werden soll (zb in anderen Code-Stellen etc.)
        // Eingaben müssen ganze Zahlen und größer -1 und kleiner Raster-Größe sein
        if (Number.isInteger(x) && Number.isInteger(y) && x < gridSize && x > -1 && y < gridSize && y > -1) {
            checkNumbers = true;
        }
        if (f === "NORTH" || f === "SOUTH" || f === "WEST" || f === "EAST") {
            checkFacing = true;
        }

        if (checkNumbers && checkFacing) {
            setPosX(x);
            setPosY(y);
            setFacing(f);
            setinteractRobot(1);
            setRobotIsNotPlaced(false);
        } else {
            if (checkNumbers === false) {
                setPlaceError(true);
            }
            if (checkFacing === false) {

                setFacingError(true);
            }
        }
    }

    // die report funktion kann an und ausgeschaltet werden
    const report = () => {
        if (reportOn) {
            setReportOn(false);
            setReportString("on");
        } else {
            setReportOn(true);
            setReportString("off");
        }
    }

    const move = () => {
        let newPos;
        // abfragen, in welche Richtung der Robo gerade schaut und je nachdem die Position ändern:
        // nord = y + 1
        // süd = y - 1
        // ost = x + 1
        // west = x - 1
        switch (facing) {
            case "NORTH":
                newPos = posY + 1;
                // hier muss jeweils nochmal überprüft werden, ob die neue Position noch auf dem Raster liegt, damit der Robo nicht herunter fällt.
                if (newPos < gridSize && newPos > -1) {
                    setPosY(newPos);
                } else {
                    setPosError(true);
                }
                break;
            case "SOUTH":
                newPos = posY - 1;
                if (newPos < gridSize && newPos > -1) {
                    setPosY(newPos);
                } else {
                    setPosError(true);
                }
                break;
            case "EAST":
                newPos = posX + 1;
                if (newPos < gridSize && newPos > -1) {
                    setPosX(newPos);
                } else {
                    setPosError(true);
                }
                break;
            case "WEST":
                newPos = posX - 1;
                if (newPos < gridSize && newPos > -1) {
                    setPosX(newPos);
                } else {
                    setPosError(true);
                }
                break;
            default:
                console.error("Fehler in switchcase")
                break;
        }
    }

    const left = () => {
        // falls zuvor eine Fehler-Meldung bzgl der Position gezeigt wurde, wird diese vor der neuen Platzierung ausgeschaltet
        setPosError(false);
        // hier wird nun das direction-Objekt verwendet, um die Drehung um zusetzen
        // hierzu habe ich die Richtungen gegen den Uhrzeigersinn nummeriert (aus Gewöhnung an die Koordinaten-Systeme in der Mathematik, welche die Quadranten gegen den Uhrzeigersinn zählen), 
        // Norden = 1
        // Westen = 2 
        // Süden = 3
        // Osten = 4
        // zb: schaut der Robo nach Norden und dreht nach links, also gegen den Uhrzeiger Sinn, muss Westen das Ergebnis sein: Norden + 1
        // von Osten auf Norden muss der Wert wieder zurückgesetzt werden und wieder bei 1 anfangen
        let newDir;
        if (direction[facing] === 4) {
            newDir = 1;
        } else {
            newDir = direction[facing] + 1;
        }
        setFacing(Object.keys(direction).find(key => direction[key] === newDir)); // "finde den Key, der den Wert der neuen Richtung besitzt"
    }

    // analog zu left()
    const right = () => {
        // falls zuvor eine Fehler-Meldung bzgl der Position gezeigt wurde, wird diese vor der neuen Platzierung ausgeschaltet
        setPosError(false);
        let newDir;
        if (direction[facing] === 1) {
            newDir = 4;
        } else {
            newDir = direction[facing] - 1;
        }
        setFacing(Object.keys(direction).find(key => direction[key] === newDir));
    }

    return (
        <Container>
            <Row className="rowTitle">
                <Col>
                    <h1>Testo Robot Challenge
                    </h1>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Row>
                        {/* Raster = Tabelle */}
                        <Table bordered>
                            <tbody>
                                {
                                    // hier mappe ich rückwärts, um die Koordinaten (0,0) unten links zu ermöglichen
                                    gridRows.slice(0).reverse().map((r) =>
                                        <tr key={r}>
                                            {
                                                // hier kann vorwärts gemappt werden, da von links nach recht von 0 - 4 gelten soll
                                                gridCols.map((c) => {
                                                    let colkey = r + "," + c;
                                                    // hier wird bestimmt, ob sich der Robo gerade in diesem Kästchen befindet
                                                    // true: der Robo muss "eingeschaltet werden" (Opacity = 1): siehe Component Box
                                                    // false: Robo wird "ausgeschaltet" (Opacity = 0)
                                                    if (posX === c && posY === r) {
                                                        return (
                                                            <td key={colkey} className="boxElem"><Box posX={c} posY={r} isRobotVisible={true} facing={facing} /></td>
                                                        )
                                                    } else {
                                                        return (
                                                            <td key={colkey} className="boxElem"><Box posX={c} posY={r} isRobotVisible={false} facing={"NO"} /></td>
                                                        )
                                                    }

                                                })
                                            }
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col md={4}></Col>
                        <Col md={8}>
                            {/* hier hatte ich das Problem, dass ich in der onSubmit-Funktion keine parameter übergeben kann (was durch die verwendung von state auch nicht nötig ist) */}
                            {/* deshalb rufe ich die place-Funktion in der handleSubmit-Funktion mit den tmp-Hooks auf */}
                            <Form onSubmit={handleSubmit} >
                                <Form.Group as={Row} className="marginBottom0">
                                    <h5>Place the robot:</h5>
                                </Form.Group>
                                <Form.Group as={Row} className="formMaxWidth">
                                    <Form.Group className="formInputPos" sm="6">
                                        <Form.Label>X-Position</Form.Label>
                                        {/* hier wird durch das Formular die Eingabe der Werte direkt überprüft und in den tmp-Hooks gespeichert */}
                                        <Form.Control type="number" step={'.'} min={0} max={gridSize - 1} onChange={(e) => setPosXTMP(parseInt(e.target.value))} />
                                    </Form.Group>

                                    <Form.Group className="formInputPos" sm="6">
                                        <Form.Label>Y-Position</Form.Label>
                                        {/* hier wird durch das Formular die Eingabe der Werte direkt überprüft und in den tmp-Hooks gespeichert */}
                                        <Form.Control type="number" step={'.'} min={0} max={gridSize - 1} onChange={(e) => setPosYTMP(parseInt(e.target.value))} />
                                    </Form.Group><br />
                                    <Form.Text className="text-muted">
                                        Only values from 0 to {gridSize - 1} are possible.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group as={Row} className="formInputDirLabel"><Form.Label >Facing</Form.Label></Form.Group>
                                <Form.Group className="formInputDir" as={Row}>
                                    <Form.Group className="formInputDirCol" sm="6">
                                        {/* durch die Radio-Buttons kann hier eine falsche Eingabe vermieden werden; Abspeicherung und tmp-Hook */}
                                        <Form.Check label="NORTH" name="groupDir" value={"NORTH"} type={'radio'} id="radioN" onChange={(e) => setFacingTMP(e.target.value)} />
                                        <Form.Check label="SOUTH" name="groupDir" value={"SOUTH"} type={'radio'} id="radioS" onChange={(e) => setFacingTMP(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="formInputDirCol" sm="6">
                                        <Form.Check label="WEST" name="groupDir" value={"WEST"} type={'radio'} id="radioW" onChange={(e) => setFacingTMP(e.target.value)} />
                                        <Form.Check label="EAST" name="groupDir" value={"EAST"} type={'radio'} id="radioE" onChange={(e) => setFacingTMP(e.target.value)} />
                                    </Form.Group>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Button className="buttonRobot" variant="primary" type="submit">Place</Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col className="padding0" md={4}></Col>
                        <Col className="padding0" md={8}>
                            <h5>Interact with the robot:</h5>
                            <br />
                            {
                                robotIsNotPlaced && (
                                    <p>Please place the robot first.</p>
                                )
                            }
                            <Button className="buttonRobot" style={{ opacity: interactRobot }} variant="success" onClick={() => left()}>Left</Button>
                            <Button className="buttonRobot" style={{ opacity: interactRobot }} variant="success" onClick={() => right()}>Right</Button> <br />
                            <br />
                            <Button className="buttonRobot" style={{ opacity: interactRobot }} variant="success" onClick={() => move()}>Move</Button>
                            <Button className="buttonRobot" style={{ opacity: interactRobot }} variant="success" onClick={() => report()}>Report {reportString}</Button> <br />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                {/* Visuelle Fehler-Meldungen */}
                <Col md={6}>
                    {
                        posError && (
                            <Alert variant={'danger'}>
                                <Alert.Heading><i className="fas fa-bolt"></i>  Attention</Alert.Heading>
                                Be careful, the Robotor almost fell down!</Alert>
                        )
                    }
                    {
                        placeError && (
                            <Alert variant={'danger'}>
                                <Alert.Heading><i className="fas fa-bolt"></i>  Attention</Alert.Heading>
                                The position is outside the grid!</Alert>
                        )
                    }
                    {
                        facingError && (
                            <Alert variant={'danger'}>
                                <Alert.Heading><i className="fas fa-bolt"></i>  Attention</Alert.Heading>
                                The viewing direction can only be NORTH, SOUTH, WEST or EAST.
                            </Alert>
                        )
                    }
                </Col>
                <Col md={6}>
                    <Row>
                        <Col className="padding0" md={4}></Col>
                        {/* Report-Funktion: Angabe der aktuellen Position und Blickrichtung */}
                        <Col className="padding0" md={8}>
                            {
                                reportOn && (
                                    <Alert variant={'info'} id="reportField">
                                        <Alert.Heading><i className="fas fa-robot myRobot"></i>  "I am here:"</Alert.Heading>
                                        <h5>Position: ({posX},{posY})</h5>
                                        <h5>Facing: {facing}</h5>
                                    </Alert>
                                )
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Playground;
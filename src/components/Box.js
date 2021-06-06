import React, { useState, useEffect } from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Box(props) {

    // diese Hooks werden innerhalb der Komponente nicht weiter verwendet, ich habe diese vorallem für das Debugging mit den React Dev Tools genutzt
    const [posX, setPosX] = useState(props.posX);
    const [posY, setPosY] = useState(props.posY);

    // Zustände für Sichtbarkeit: der Robo ist im Prinzip in jedem Kästchen mit vier Blickrichtungen vorhanden; 
    // nur dort, wo er sich aktuell befindet, wird er "eingeschaltet", also die Transparenz auf 1 gesetzt; gleiches gilt für die Richtungsanzeige
    // die Eingabe, wo sich der Robo befindet, wird in die props übergeben 
    const [robotOpacity, setRobotOpacity] = useState(0);
    const [facingNorthOpacity, setFacingNorthOpacity] = useState(0);
    const [facingSouthOpacity, setFacingSouthOpacity] = useState(0);
    const [facingWestOpacity, setFacingWestOpacity] = useState(0);
    const [facingEastOpacity, setFacingEastOpacity] = useState(0);

    // ersetzt die ComponentDidMount bzw Update Funktion bei Hooks
    useEffect(() => {
        if (props.isRobotVisible) {
            setRobotOpacity(1);
            switch (props.facing) {
                case "NORTH":
                    setFacingNorthOpacity(1);
                    setFacingSouthOpacity(0);
                    setFacingWestOpacity(0);
                    setFacingEastOpacity(0);
                    break;
                case "SOUTH":
                    setFacingNorthOpacity(0);
                    setFacingSouthOpacity(1);
                    setFacingWestOpacity(0);
                    setFacingEastOpacity(0);
                    break;
                case "WEST":
                    setFacingNorthOpacity(0);
                    setFacingSouthOpacity(0);
                    setFacingWestOpacity(1);
                    setFacingEastOpacity(0);
                    break;
                case "EAST":
                    setFacingNorthOpacity(0);
                    setFacingSouthOpacity(0);
                    setFacingWestOpacity(0);
                    setFacingEastOpacity(1);
                    break;
                default:
                    break;
            }
        } else {
            setRobotOpacity(0);
            setFacingNorthOpacity(0);
            setFacingSouthOpacity(0);
            setFacingWestOpacity(0);
            setFacingEastOpacity(0);
        }
    });

    return (
        <div className="box">
            <Row>
                <Col className="myCol"></Col>
                <Col className="myCol"><i className="fas fa-caret-up dirArrow" style={{ opacity: facingNorthOpacity }}></i></Col>
                <Col className="myCol"></Col>
            </Row>
            <Row>
                <Col className="myCol myColSpec"><i className="fas fa-caret-left dirArrow dirArrowSpec" style={{ opacity: facingWestOpacity }}></i></Col>
                <Col className="myCol"><i className="fas fa-robot myRobot" style={{ opacity: robotOpacity }}></i></Col>
                <Col className="myCol"><i className="fas fa-caret-right dirArrow dirArrowSpec" style={{ opacity: facingEastOpacity }}></i></Col>
            </Row>
            <Row>
                <Col className="myCol"></Col>
                <Col className="myCol"><i className="fas fa-caret-down dirArrow" style={{ opacity: facingSouthOpacity }}></i></Col>
                <Col className="myCol"></Col>
            </Row>
        </div>
    )
}

export default Box;
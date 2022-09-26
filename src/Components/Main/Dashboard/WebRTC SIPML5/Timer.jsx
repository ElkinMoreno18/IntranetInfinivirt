import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

export default function Timer() {
  let timer;
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    timer = setInterval(() => {
      setSeconds(seconds + 1);
      if (seconds === 59) {
        setMinutes(minutes + 1);
        setSeconds(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <Container className="d-flex justify-content-center w-25 h-25">
      <h5 className="text-white">
        {minutes < 10 ? "0" + minutes : minutes}:
        {seconds < 10 ? "0" + seconds : seconds}
      </h5>
    </Container>
  );
}

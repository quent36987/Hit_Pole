import { useState } from "react";
import { auth } from "./../firebase";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { AppState } from "../Context";
import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "@material-ui/core";




const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAlert } = AppState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);   

  function forgotPassword(email) {
      return sendPasswordResetEmail(auth, email, {
        url: `https://sport-apli.web.app/`,
      });
  }

  const handleSubmit = async () => {
    if (!email || !password) {
      console.log("email or password is empty");
      setAlert({
        open: true,
        message: "Please fill all the Fields",
        type: "error",
      });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign Up Successful. Welcome" + result.user.email);
      window.location.href = "/";
      setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${result.user.email}`,
        type: "success",
      });
    } catch (error) {
      console.log(error.message);
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
      return;
    }
  };


  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot your password ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>what is your email address ?</Modal.Body>
        <input style={{ "margin": "15px" }} type="email" autoComplete="email" onChange={(e) => setEmail(e.target.value)} placeholder="email" value={email} ></input>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={async (e) => {
            e.preventDefault();
            try {await forgotPassword(email);
            setAlert({
              open: true,
              message: `An email has been sent to ${email}`,
              type: "success",
            });
            }
            catch (error) {
              setAlert({
                open: true,
                message: error.message,
                type: "error",
              });
            }
            handleClose();
          }}>
            Send new password
          </Button>
        </Modal.Footer>
      </Modal>


      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label >Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Enter email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" />
        </Form.Group>
        <p>Not registered yet ?<Link href="/auth/signup" >Clic ici !</Link></p>
        <p>password forget  ? <Link onClick={handleShow} >Clic here !</Link></p>
        <Button onClick={handleSubmit} >
          Submit
        </Button>
      </Form>
     
      
    </>
  );
};

export default Login;

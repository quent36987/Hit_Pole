
import { useState } from "react";
import { createUserWithEmailAndPassword} from "firebase/auth";
import { auth, db } from "../firebase";
import { AppState } from "../Context";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "@material-ui/core";



const Signup = () => {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tel,setTel] = useState("");
  const [genre, setGenre] = useState("");
  const { setAlert } = AppState();


  async function add() {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Sign Up Successful. Welcome" + result.user.email);
      try {
        await setDoc(doc(db, "Users", result.user.uid), {
          firstName: firstName,
          lastName: lastName,
          genre: genre,
          date_inscription: Timestamp.now(),
          solde : 0,
          tel : tel,
        });
        setAlert({
          open: true,
          message: `Sign Up Successful. Welcome ${result.user.email}`,
          type: "success",
        });
        window.location.href = "/";
      }
      catch (error) {
        console.log(error);
        setAlert({
          open: true,
          type: "error",
          message: "Error on creating user"
        });
      }
    } catch (error) {
      console.log("error" + error.message);
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
      return;
    }
  };


  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      add();
    }
    setValidated(true);
    console.log(genre);
  };

  return (<>
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom0"  >
          <Form.Label>Genre</Form.Label>
          <Form.Select aria-label="" value={genre}
            onChange={(e) => { setGenre(e.target.value) }}
            required
          >
            <option value="no">Select</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>Prénom</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Prénom"
            autoComplete="given-name"
            defaultValue=""
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom03">
          <Form.Label>Nom</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Nom"
            autoComplete="lname"
            defaultValue=""
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom03">
          <Form.Label>Téléphone</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="06 xx xx xx xx"
            autoComplete="lname"
            defaultValue=""
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom04">
          <Form.Label>Email</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text id="inputGroupPrepend1">@</InputGroup.Text>
            <Form.Control
              type="email"
              placeholder="Email@email.fr"
              autoComplete="email"
              aria-describedby="inputGroupPrepend"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your email.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="validationCustom05">
          <Form.Label>Mot de passe</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text id="inputGroupPrepend2">🔑</InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="**********"
              autoComplete="new-password"
              aria-describedby="inputGroupPrepend"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your password.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Text id="passwordHelpBlock" muted>
        Votre mot de passe doit comporter entre 8 et 20 caractères, contenir des lettres et des chiffres, et
          ne doit pas contenir d'espaces, de caractères spéciaux ou d'emoji.
        </Form.Text>
      </Row>
      <p>Déjà un compte ? <Link href="/auth/login" >Connectez-vous ici !</Link></p>
      <Button variant="primary" type="submit">Register</Button>
    </Form>
  </>
  );
}

export default Signup;

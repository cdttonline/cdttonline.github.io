import {Button, Container} from "react-bootstrap";
import "./NavPagesInformation.css";
import MailTo from "./MailTo";
import {Link} from "react-router-dom";

const Contact = () => {
    return (
        <>
            <Container>
                <div className="text-start" id="contactPageContainer">
                    <h3 className="mt-3 fw-bold">Contacts</h3>

                    <p className="mt-4 mb-0 fw-bold">Principal investigators</p>
                    <p className="mb-0">Christian Giguère (University of Ottawa) - Email: <Link className="btn-link" to={"mailto:cgiguere@uottawa.ca"}>cgiguere@uottawa.ca</Link>
                        <br/>Josée Lagacé (University of Ottawa) - Email: <Link className="btn-link" to={"mailto:jlagace@uottawa.ca"}>jlagace@uottawa.ca</Link>
                        <br/>Kathleen Pichora-Fuller (University of Toronto Mississauga) – Email: <Link className="btn-link" to={"mailto:k.pichora.fuller@utoronto.ca"}>k.pichora.fuller@utoronto.ca</Link>

                    </p>

                    <p className="mt-4 mb-0 fw-bold">Software development</p>
                    <p className="mb-0">
                        Nicolas N. Ellaham (University of Ottawa)
                        <br/>Mélina Rochon (University of Ottawa)
                    </p>

                    <p className="mt-5 fst-italic">The rights to the Canadian Digit Triplet Test (CDTT) are owned by the University of Ottawa.</p>
                </div>
            </Container>
        </>
    )
}

export default Contact;
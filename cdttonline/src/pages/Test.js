import { Container } from "react-bootstrap";
import { TestParameters } from "../components/TestParameters";

const Test = () => {
    return (
        <>
            <Container>
                <h3 className="mt-3 fw-bold">Canadian Digit Triplet Test</h3>
                <TestParameters/>
            </Container>
        
        </>
    )
}

export default Test;
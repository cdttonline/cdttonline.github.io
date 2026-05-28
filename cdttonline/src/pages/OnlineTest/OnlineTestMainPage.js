import { Container } from "react-bootstrap";
import { TestParameters } from "../../components/TestParameters";
import {useOnlineTestTexts} from "../../translations/i18nHelpers";

const OnlineTestMainPage = () => {

    const texts = useOnlineTestTexts()

    return (
        <>
            <Container>
                <h3 className="mt-3 fw-bold">{texts.title}</h3>
                <TestParameters/>
            </Container>
        
        </>
    )
}

export default OnlineTestMainPage;
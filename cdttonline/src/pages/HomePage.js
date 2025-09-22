import {Button, Container} from "react-bootstrap";
import "./NavPagesInformation.css";
import {Link, useNavigate} from "react-router-dom";
export const HomePage=()=> {

    const navigate = useNavigate();

    const navigateToResearchPlatform = () => {
        navigate('/researchPlatform');
    }
    const navigateToTest = () => {
        navigate('/test');
    }
    return (
        <>
            <Container>

                <div className="text-start" id="aboutPageContainer">
                    <h3 className="mt-3 fw-bold">About</h3>

                    <p className="mt-4 mb-0">The Canadian Digit Triplet Test (CDTT) is a hearing screening tool
                        developed by
                        a team of
                        researchers at the University of Ottawa and the University of Toronto. The test uses an adaptive procedure to
                        determine the speech
                        recognition threshold (SRT) for digit triplets in noise. The CDTT follows the guidelines of the
                        International
                        Collegium of Rehabilitative Audiology (<Link className="btn-link" to={"https://icra-audiology.org/"} target="_blank">ICRA</Link>) for the construction of <Link className="btn-link" target="_blank" to={"https://www.tandfonline.com/doi/full/10.3109/14992027.2015.1030513"}> multilingual speech
                        tests</Link>.</p>
                    {/*<br/>*/}
                    <div className="d-flex flex-column align-items-start mt-2 mb-2">
                        <Link className="btn-link" to={"https://canadianaudiologist.ca/u-of-o-feature-4/"} target="_blank">Feature
                            article in Canadian Audiologist</Link>
                        {/*<br/>*/}
                        <Link className="btn-link mb-1" to={"https://pubs.aip.org/asa/jasa/article/147/3/EL252/997279/Development-of-the-Canadian-Digit-Triplet-Test-in"} target="_blank">Test
                            development article in JASA Express Letters</Link>

                    </div>
                    {/*<br/>*/}

                    <p>The CDTT was first made available for testing in the two official languages of Canada, English
                        and French, using
                        digits from a bilingual male and a bilingual female presented in speech-spectrum noise. The test
                        has been included
                        in two large-scale multi-site national studies, the <Link className="btn-link"
                                                                                    to={"https://ccna-ccnv.ca/en/"} target="_blank">Canadian
                            Consortium on Neurodegeneration in
                            Aging</Link> and the <Link className="btn-link" to={"https://www.clsa-elcv.ca/"} target="_blank">Canadian Longitudinal
                            Study on Aging</Link>, and made available to other researchers. Additional language modules have been developed in Asante-Twi and Ghanaian English.</p>

                    <ul>
                        <li>The <Link className="btn-link" to={"/researchPlatform"}>research software platform</Link> is the
                            most comprehensive version of the CDTT. It provides
                            complete control over the test parameters and allows for the easy integration of new
                            language/talker modules and additional user-defined noise maskers. Researchers can apply for
                            a non-commercial software license for academic and research purposes.
                        </li>
                        <li>An <Link className="btn-link" to={"/test"}>online version</Link> is available for demonstration purposes.</li>
                    </ul>
                </div>


            </Container>
        </>
    );
}
import {Button, Container, Image} from "react-bootstrap";
import "./NavPagesInformation.css"
import {Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const ResearchPlatform = () => {

    useEffect(() => {

    }, []);
    const navigate = useNavigate();

    const navigateToContact = () => {
        navigate('/contact');
    }
    return (
        <>
            <Container>

                <div className="text-start" id="researchPlatformPageContainer">
                    <h3 className="mt-3 fw-bold">Research Platform</h3>

                    <p className="mt-4 mb-0 fw-bold">Software and hardware considerations</p>
                    <p className="mb-0">The CDTT software was developed as a cross-platform Java application and it
                        can be run on different operating systems (e.g., Windows, macOS).</p>
                    {/*<br/>*/}

                    <ul>
                        <li>The main interface provides controls for the test operator to enter participant information,
                            select test parameters, run a test, and save the results in MS-Excel.
                        </li>
                        <li>Participants enter their digit responses on-screen or using an external USB numeric
                            keypad.
                        </li>
                        <li>Use of an external USB sound card (e.g., E10K Olympus 2 by FiiO) is recommend for
                            portability and reproducibility across computers.
                        </li>
                        <li>Results have been found to be largely insensitive to the choice of earphones, but use of
                            Radioear DD45 audiometric earphones is recommended for strict comparison to the <Link
                                className="btn-link"
                                to={"https://pubs.aip.org/asa/jasa/article/147/3/EL252/997279/Development-of-the-Canadian-Digit-Triplet-Test-in"}
                                target="_blank">CDTT
                                normative data.</Link>
                        </li>
                        <li>Results obtained to date suggest that hearing screening with the CDTT can be administered
                            with supra-aural earphones (Radioear DD45 or similar) on testing sites with background noise
                            levels not exceeding 60 dBA, while the use of sound-attenuating circumaural earphones
                            (Radioear DD450 or similar) should be considered on testing sites with background noise
                            levels up to 75 dBA.
                        </li>
                    </ul>

                    {/* Image of the user interface and accessories */}
                    <Image className="w-100"
                           src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Script/Images/Research-interface-EN.jpg"
                           alt="Research Interface"></Image>

                    <p className="mt-4 mb-0 fw-bold">Software and hardware considerations</p>
                    <ul>
                        <li>Testing languages: Canadian English and French (2016), Asante-Twi and Ghanaian English
                            (2023)
                        </li>
                        <li>Talkers: one or two talkers (male and female) per language/dialect</li>
                        <li>Digits: diotic (in-phase) or dichotic (antiphase) presentation</li>
                        <li>Maskers: Talker-specific speech spectrum noise (default) and user-defined noises</li>
                        <li>Test modes: Adaptative speech-recognition threshold search (SRT) or fixed signal-to-noise
                            ratio (SNR)
                        </li>
                    </ul>

                    <p className="mt-4 mb-0">User manual (upcoming)</p>
                    <p className="mt-0 mb-0">Video demonstration (upcoming)</p>

                    <p className="mt-4 mb-0 fw-bold">Availability</p>
                    <p className="m-0">Researchers can apply for a non-commercial software license for academic
                        and research purposes. Please fill in <Link className="btn-link"
                                                                      to={"https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fraw.githubusercontent.com%2FMelinaRochon%2FCDTT_lists%2Frefs%2Fheads%2Fmain%2FScript%2FNon-commercial_EULA_(CDTT)_Request_Form.docx&wdOrigin=BROWSELINK"}
                                                                      target="_blank">this form</Link> and send by
                        email to one of the <Link className="btn-link" to={"/contact"}>Principal Investigators</Link></p>
                </div>
            </Container>
        </>
    )
}
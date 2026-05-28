import {Link} from "react-router-dom";
import {Trans} from "react-i18next";
import React from "react";
import {useNavBarTexts} from "../translations/i18nHelpers";

 const Footer = () => {
     const texts = useNavBarTexts();

     return (
        <footer className="mt-auto text-center align-bottom text-lg-start bg-body-tertiary text-muted">
            <div className="text-center p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.05)', fontSize: '12px'}}>
                <div className="d-flex flex-row flex-wrap align-items-center justify-content-center mb-2 pt-1">
                    <div className="">
                        <Link className="me-3" to={"/"}>
                            <img alt="DTT logo"
                                 src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Script/Images/icon-DTT.png"
                                 width="20"
                                 height="20"
                            />
                        </Link>
                        <Link className="me-3" to="/">{texts.about}</Link>
                        <Link className="me-3 text-wrap"
                              to={"/researchPlatform"}>{texts.researchPlatform}</Link>
                        <Link className="me-3" to={"/test"}>{texts.test}</Link>
                        <Link className="me-3" to={"/contact"}>{texts.contact}</Link>
                    </div>
                </div>
                <Trans i18nKey={texts.rights} components={{i: <i/>}}/>
            </div>
        </footer>
     );
}

export default Footer;
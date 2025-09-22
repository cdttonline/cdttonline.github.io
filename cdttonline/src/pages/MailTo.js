import React from "react";
import { Link } from "react-router-dom";

const MailTo = (label, mailto) => {
    return (
        <Link
            to='#'
            onClick={(e) => {
                window.location.href = mailto;
                e.preventDefault();
            }}
        >
            {label}
        </Link>
    );
};

export default MailTo;
import React, { useState, useRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames';
import ReCAPTCHA from "react-google-recaptcha";

function LinkAdd() {
    const reRef = useRef();

    let { course, section } = useParams();
    const [type, setType] = useState("");
    const [customType, setCustomType] = useState("");
    const [url, setURL] = useState("");
    const [terms, setTerms] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [validateTerms, setValidateTerms] = useState(false);

    const formValid = {
        "type": type !== "Select a type..." && type !== "",
        "customType": (type !== "Other" && customType === "") || (customType.length > 0 && customType.length < 20 && type === "Other"),
        "url": /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(url),
        "terms": terms
    }

    const submit = async (e) => {
        e.preventDefault();
        try {
            const request = {
                "type": (type === "Other" ? customType : type),
                "url": url,
                "terms": terms,
                "captcha": await reRef.current.executeAsync()
            }
            reRef.current.reset();
            await axios.post(`http://localhost:8080/courses/${course}/sections/${section}/link`, request)
            setSubmitted(true);
        }
        catch {
            // inject banner
        }
    }
    return (
        <div className="nav-offset">
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h1>Add a Link for {course}, Section {section}</h1>
                        </div>
                    </div>
                </div>
            </div>
            { !submitted &&
                <div className="container">
                    <form>
                        <div className="form-group">
                            <label>Type</label>
                            <select className={classNames({
                                "form-control": true,
                                "rounded-0": true,
                                "is-valid": formValid.type,
                                "is-invalid": !formValid.type && type
                            })} value={type} onChange={(e) => setType(e.target.value)} >
                                <option value="none">Select a type...</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Discord">Discord</option>
                                <option value="Facebook Messenger">Facebook Messenger</option>
                                <option value="Facebook Group">Facebook Group</option>
                                <option value="WeChat">WeChat</option>
                                <option value="Slack">Slack</option>
                                <option value="Telegram">Telegram</option>
                                <option value="Signal">Signal</option>
                                <option value="Other">Other</option>
                            </select>
                            {
                                type === "Other" &&
                                <input
                                    type="text"
                                    className={classNames({
                                        "form-control": true,
                                        "rounded-0": true,
                                        "mt-3": true,
                                        "is-valid": formValid.customType,
                                        "is-invalid": !formValid.customType && customType
                                    })}
                                    value={customType} onChange={(e) => setCustomType(e.target.value)}
                                    placeholder="Type" />
                            }
                            {/* <small className="form-text text-muted">For WeChat</small> */}
                            <div className="invalid-feedback">Please enter a valid type.</div>
                        </div>

                        <div className="form-group">
                            <label>URL</label>
                            <input
                                type="text"
                                className={classNames({
                                    "form-control": true,
                                    "rounded-0": true,
                                    "is-valid": formValid.url,
                                    "is-invalid": !formValid.url && url
                                })}
                                id="url"
                                value={url}
                                onChange={(e) => {
                                    setURL(e.target.value)
                                }}
                                placeholder="https://www.google.com" />
                            <div className="invalid-feedback">Please enter a valid URL, including http or https.</div>
                        </div>
                        <div className="form-group">
                            <div className="form-check">
                                <input className={classNames({
                                    "form-check-input": true,
                                    "is-valid": formValid.terms,
                                    "is-invalid": validateTerms && !formValid.terms
                                })}
                                    type="checkbox"
                                    checked={terms}
                                    onChange={() => {
                                        setValidateTerms(true)
                                        setTerms(!terms)
                                    }} />
                                <label className="form-check-label">I agree that the URL above links to an online community of the indicated type for this course and section, and is for school purposes only.</label>
                                <label className="form-check-label"><small>Links to malicious, inappropriate, copyrighted or otherwise illegal content including Zoom and any online lecture links are not allowed.</small></label>
                                <div className="invalid-feedback">Please agree to the terms to continue.</div>
                            </div>
                        </div>

                        <ReCAPTCHA sitekey="6LdgVNYZAAAAAPBMSaqI_px7PyL1As_XkTmLAXVa" size="invisible" ref={reRef} />
                        <button type="submit" className="btn btn-danger" onClick={submit} disabled={!Object.values(formValid).every(formFieldValid => formFieldValid)}>Create Link</button>
                    </form>
                </div>
            }
            {
                submitted &&
                <div className="container">
                    <h1><i className="fas fa-check text-danger" /></h1>
                    <h1>The link has been added!</h1>
                    <a className={"btn btn-danger mt-5"} href={`/courses/${course}`} role="button">{`Go Back to ${course}`}</a>
                </div>
            }
        </div>
    );
}

export default LinkAdd;

//Load the Required component or modules
import React, { useState } from 'react';
import renderHTML from 'react-render-html';
import useForm from "react-hook-form";

const Home = () => {

    // Set the Vlaidation Form Ready to handle inpur validation
    const { handleSubmit, register, errors, reset } = useForm();
    const [isLoading, setiIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");


    // Submit button will handle if clicked
    const onSubmit = async values => {

        //values will have all the information inside the form if all valid values then it will send the data to server using API
        setiIsLoading(true);

        //Read API base URL from .env
        let url = process.env.REACT_APP_API_URL;
        const options = {
            method: 'post',
            body: JSON.stringify(values),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        };

        //Call API
        const response = await fetch(url+`/users/checkin`, options);
        //convert response to json
        const json = await response.json();
        if(json.success) {
            setMessageType("success");
        } else {
            setMessageType("danger");
        }
        reset();
        setMessage(json.msg);
        setiIsLoading(false);
    };

    return (
        <div className="container contact-form">
            <div className="contact-image">
                <img src={require('../../static/img/visitors.png')} alt="visitors.png"/>
                <h3>Check In</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input type="text"
                                   name="visitor_name"
                                   className="form-control"
                                   placeholder="Your Name *"
                                   //value={"Sanjay Singh"}
                                   ref={register({
                                       required: 'Required'
                                   })}
                                   onChange={event =>{
                                       //console.log(event)
                                   }}
                            />
                            <span className={"form-error-msg"}>{errors.visitor_name && errors.visitor_name.message}</span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <input type="text"
                                   name="visitor_phone"
                                   className="form-control"
                                   placeholder="Your Phone *"
                                   //value={"7597561368"}
                                   ref={register({
                                       required: 'Required',
                                       pattern: {
                                           value: /^\d{10}$/,
                                           message: "Invalid phone number (Only 10 digits)"
                                       }
                                   })}
                                   onChange={event =>{
                                       //console.log(event)
                                   }}
                            />
                            <span className={"form-error-msg"}>{errors.visitor_phone && errors.visitor_phone.message}</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input type="text"
                                   name="visitor_email"
                                   className="form-control"
                                   placeholder="Your Email *"
                                   //value={"manishprajapat41@gmail.com"}
                                   ref={register({
                                       required: 'Required',
                                       pattern: {
                                           value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                           message: "Invalid email address"
                                       }
                                   })}
                                   onChange={event =>{
                                       //console.log(event)
                                   }}
                            />

                            <span className={"form-error-msg"}>{errors.visitor_email && errors.visitor_email.message}</span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <input type="text"
                                   name="host_name"
                                   className="form-control"
                                   placeholder="Host Name *"
                                   //value={"Vivek Singh"}
                                   ref={register({
                                       required: 'Required'
                                   })}
                                   onChange={event =>{
                                       //console.log(event)
                                   }}
                            />
                            <span className={"form-error-msg"}>{errors.host_name && errors.host_name.message}</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input type="text"
                                   name="host_email"
                                   className="form-control"
                                   placeholder="Host Email *"
                                   //value={"manishprajapat41@gmail.com"}
                                   ref={register({
                                       required: 'Required',
                                       pattern: {
                                           value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                           message: "Invalid email address"
                                       }
                                   })}
                                   onChange={event =>{
                                       //console.log(event)
                                   }}
                            />
                            <span className={"form-error-msg"}>{errors.host_email && errors.host_email.message}</span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <input type="text"
                                   name="host_phone"
                                   className="form-control"
                                   placeholder="Host Phone *"
                                   //value={"7597561368"}
                                   ref={register({
                                       required: 'Required',
                                       pattern: {
                                           value: /^\d{10}$/,
                                           message: "Invalid phone number (Only 10 digits)"
                                       }
                                   })}
                                   onChange={event =>{
                                       //console.log(event)
                                   }}
                            />
                            <span className={"form-error-msg"}>{errors.host_phone && errors.host_phone.message}</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group text-center">
                            {
                                message && messageType ?
                                    <div className={messageType == "success" ? "alert alert-success": (messageType == "danger") ? "alert alert-danger": null} role="alert">
                                        {renderHTML(message)}
                                    </div>
                                    :null
                            }
                            <button type="submit" className="btn btn-outline-primary">
                                {
                                    isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>: null
                                }
                            &nbsp; Submit
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Home;
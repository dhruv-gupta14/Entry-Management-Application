//Load the Required component or modules
import React, { useState } from 'react';
import useForm from "react-hook-form";
import renderHTML from "react-render-html";

const Checkout = () => {

    // Set the Vlaidation Form Ready to handle inpur validation
    const { handleSubmit, register, errors, reset } = useForm();
    const [isLoading, setiIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [checkInId, setCheckInID] = useState("");

    // Submit button will handle if clicked
    const onSubmit = async values => {

        //values will have all the information inside the form if all valid values then it will send the data to server using API
        setiIsLoading(true);

        //Read API base URL from .env
        let url = process.env.REACT_APP_API_URL;
        const options = {
            method: 'get',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        };
        //Call API
        const response = await fetch(url+`/users/checkin/${values.checkin_id}`, options);
        //convert response to json
        const json = await response.json();
        if(json.success) {
            setMessageType("success");
            setCheckInID(values.checkin_id);
            let response_results = json.results;
            //Set the alert message to show on page.
            setMessage(`${response_results.visitor_name} (HOST: ${response_results.host_name}), Do you want to checkout?`);
        } else {
            setMessage(json.msg);
            setMessageType("danger");
        }
        setiIsLoading(false);
    };


    //checkOut Submit button will handle if clicked
    const checkOut = async () => {

        setiIsLoading(true);
        //Read API base URL from .env
        let url = process.env.REACT_APP_API_URL;
        const options = {
            method: 'put',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        };

        //Call API
        const response = await fetch(url+`/users/checkout/${checkInId}`, options);
        //convert response to json
        const json = await response.json();
        if(json.success) {
            //Successfull
            setMessageType("success");
        } else {
            setMessageType("danger");
        }
        reset();
        setCheckInID("")
        setMessage(json.msg);
        setiIsLoading(false);
    }

    return (
        <div className="container contact-form">
            <div className="contact-image">
                <img src={require('../../static/img/visitors.png')} alt="visitors.png"/>
                <h3>Check Out</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <input type="text"
                                   name="checkin_id"
                                   className="form-control"
                                   placeholder="Check In ID *"
                                   ref={register({
                                       required: 'Required'
                                   })}
                                   onChange={event =>{
                                       //console.log(event)
                                   }}
                            />
                            <span className={"form-error-msg"}>{errors.checkin_id && errors.checkin_id.message}</span>
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
                            {
                                message && messageType && checkInId !=""?
                                    <button type={"button"} onClick={checkOut} className="btn btn-outline-primary" disabled={isLoading}>
                                        {
                                            isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>: null
                                        }
                                        &nbsp; Yes, Please checkout
                                    </button>
                                    :
                                    <button type="submit" className="btn btn-outline-primary" disabled={isLoading}>
                                        {
                                            isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>: null
                                        }
                                        &nbsp; Submit
                                    </button>
                            }

                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Checkout;
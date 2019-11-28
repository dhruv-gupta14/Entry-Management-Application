const v = require('node-input-validator');
const {ObjectId} = require('mongodb');
const config = require('../config/config');
const helpers = require('../helpers/helpers');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
const nodemailer = require("nodemailer");
var unirest = require('unirest');
var ejs = require('ejs')
    , fs = require('fs');
var mongodb = require("mongodb");
var moment = require("moment");
// Models
const Entry = require('../models/entries.model');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'ENTER EMAIL ID',                //enter your email id and password of gmail account
        pass: 'ENTER YOUR PASSWORD'
    }
});

async function sendEmail (options) {

    let info = await transporter.sendMail({
        from: '"YOUR NAME" <ENTER E-MAIL ID>',    // enter your name and email id
        to: options.to,
        subject: options.subject,
        html: options.html
    });
}

async function sendSMS (options) {

    var req = unirest("POST", "https://www.fast2sms.com/dev/bulk");

    req.headers({
        "authorization": process.env.SMS_API_KEY
    });

    req.form({
        "sender_id": "FSTSMS",
        "message": options.message,
        "language": "english",
        "route": "p",
        "numbers": options.number,
    });

    req.end(function (res) {
        if (res.error) throw new Error(res.error);

        console.log(res.body);
    });
}

/** Check IN Request, It will read the information from the post request e.g. visitor_name, visitor_phone, visitor_email, host_name, host_phone, host_email */
exports.check_in = async (req, res) => {

    var response = {"success": false, "msg": "Invalid Request", "errors": [], 'results': {}};
    let params = req.body;

    // Apply Required validation on each params
    let constraints = {
        visitor_name: "required", visitor_phone: 'required', visitor_email: 'required',
        host_name: 'required', host_phone: 'required', host_email: 'required'
    };

    let validator = new v(params, constraints);
    // Check validation using validator
    let matched = await validator.check();
    if (!matched) {
        response['msg'] = 'Required fields are missing';
        response['errors'] = validator.errors;
        return res.json(response);
    }

        //Check weather already check in or not
        let isExists = await Entry.findOne({ check_out_time: null , $or:[ {visitor_phone: params.visitor_phone}, {visitor_email: params.visitor_email}] });

        if(isExists) {
            isExists = isExists.toJSON();
            if(!_.isDate(isExists.check_out_time)) {
                // Return with a message
                response['msg'] = 'Sorry!! You already checked in';
                return res.json(response);
            }
        }
        // Create a Create Object
        let createObj = {
            visitor_name: params.visitor_name, visitor_phone: params.visitor_phone,
            visitor_email: params.visitor_email, host_name: params.host_name,
                host_phone: params.host_phone, host_email: params.host_email
        };

        // Create a Entry using createObj
        const createdDoc = await Entry.create(createObj);
        if(createdDoc) {

            let entryDoc = createdDoc.toJSON();

            //Read the sample email format
            var visitor_str = fs.readFileSync('email_templates/visitor_checkin.ejs', 'utf8');
            var visitor_render_html = ejs.render(visitor_str, {
                check_in_id: entryDoc._id //Pass the required fields that will be override in template
            });

            response['success'] = true;
            response['results'] = {id: entryDoc._id};
            response['msg'] = visitor_render_html;
            res.json(response);

            let email_options = {
                to: entryDoc.visitor_email,
                subject: "Check In Confirmed",
                html: visitor_render_html
            }

            //Send email  to visitor
            await sendEmail (email_options);

            let sms_options = {
                message: `Thanks for the check in, your check i n ID is ${entryDoc._id}.`,
                number: entryDoc.visitor_phone
            }
            //Send SMS to visitor
            await sendSMS (sms_options);

            var visitor_info_to_host_str = fs.readFileSync('email_templates/visitor_info_to_host.ejs', 'utf8');

            let formatedTime = moment(entryDoc.check_in_time).utcOffset('+5:30').format('dddd, MMMM Do YYYY, h:mm:ss a');
            entryDoc.check_in_time = formatedTime;

            var visitor_info_to_host_html = ejs.render(visitor_info_to_host_str, {entryDoc});

            let host_email_options = {
                to: entryDoc.host_email,
                subject: "Visitor Check In",
                html: visitor_info_to_host_html
            }

            //Send email  to host
            await sendEmail (host_email_options);
            let host_sms_options = {
                message: `Here are your visitor details-
                            Name of visitor: ${entryDoc.visitor_name}
                            Phone: ${entryDoc.visitor_phone}
                            Email: ${entryDoc.visitor_email}
                            Check In Time: ${entryDoc.check_in_time}.`,
                number: entryDoc.host_phone
            }
            //Send sms  to host
            await sendSMS (host_sms_options);
        } else {
            response['msg'] = 'Check in unsuccessful';
            res.json(response);
        }
}

/** Check IN Request, It will read the information from the get query string  e.g. id */
exports.get_checkin_info = async (req, res) => {

    var response = {"success": false, "msg": "Invalid Request", "errors": [], 'results': {}};
    let id = req.params.id; // read id from query params

    //Check ID is valid
    if(!mongodb.ObjectID.isValid(id)) {
        response['msg'] = 'Please enter valid check in ID';
        return res.json(response);
    }

    //Find the data using provided ID
    let entryData = await Entry.findById(id);
    if(entryData) {

        entryData = entryData.toJSON(); // convert mongoose Object to simple json object to read the information

        if(_.isDate(entryData.check_out_time)) { // //Check weather already checked out

            response['msg'] = 'Sorry!! Already checked out';
            return  res.json(response);
        }

        response['success'] = true;
        response['msg'] = 'successfull';
        response['results'] = entryData;
    } else {
        response['msg'] = 'Record not found, Please enter valid check in ID';
    }
    return res.json(response);
}

/** Check IN Request, It will read the information from the get query string  e.g. id */
exports.update_checkin_info = async (req, res) => {

    var response = {"success": false, "msg": "Invalid Request", "errors": [], 'results': {}};
    let id = req.params.id;

    //Check ID is valid
    if(!mongodb.ObjectID.isValid(id)) {
        response['msg'] = 'Please enter valid check in ID';
        return res.json(response);
    }

    //Find the data using provided ID
    const entryData = await Entry.findById(id);
    if(entryData) {

        let updateInfo = {check_out_time: new Date};
        await entryData.update(updateInfo);
        response['success'] = true;
        response['msg'] = 'Thank you, Check out is successful';
        res.json(response);

        const findEntry = await Entry.findById(id);
        let newData = findEntry.toJSON(); // convert mongoose Object to simple json object to read the information

        //Read the sample email format

        var visitor_str = fs.readFileSync('email_templates/visitor_checkout.ejs', 'utf8');

        //Set the data for email template to be replace
        newData.check_in_time = moment(newData.check_in_time).utcOffset('+5:30').format('dddd, MMMM Do YYYY, h:mm:ss a');
        newData.check_out_time = moment(newData.check_out_time).utcOffset('+5:30').format('dddd, MMMM Do YYYY, h:mm:ss a');
        var visitor_render_html = ejs.render(visitor_str, {newData}); //Pass the required fields that will be override in template

        //Create a object for email
        let email_options = {
            to: newData.visitor_email,
            subject: "Check Out Details",
            html: visitor_render_html
        }

        //Send email  to visitor
        await sendEmail (email_options);

        let visitor_sms_options = {
            message: `Here are your host details-
                            Name of host: ${newData.host_name}
                            Phone: ${newData.host_phone}
                            Email: ${newData.host_email}
                            Check In Time: ${newData.check_in_time}
                            Check Out Time: ${newData.check_out_time}
                            Address visited: xyz office
                        `,
            number: newData.visitor_phone
        }

        //Send sms  to visitor
        await sendSMS (visitor_sms_options);
    } else {
        response['msg'] = 'un successful';
        return res.json(response);
    }
}
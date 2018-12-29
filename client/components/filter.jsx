import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import {renderMultiselect, renderTextField} from "../common/forms/input-types/index";
import {validate_filters as validate} from './../common/forms/validation';
import LaddaButton, {SLIDE_UP, XL} from "react-ladda";
import {Constants} from '../constants';
import {Gen} from "../helpers/gen";

class Filter extends Component {

    constructor(props){
        super(props);

        this.state = {
            loading: false,
        }
    }

    updateState(obj) {
        const newState = Gen.objectCopy(this.state);
        const key = Object.keys(obj)[0];
        const value = obj[key];

        newState[key] = value;
        this.setState(newState);
    }

    submit(data) {
        console.log(data);
        let dataCopy = {};
        if(data.name) {
            dataCopy.name = data.name;
        }

        if(data.city) {
            dataCopy.city = data.city;
        }

        if(this.props.userId) {
            dataCopy.UserId = [this.props.userId];
        } else {
            dataCopy.UserId = [];
        }

        dataCopy.time = [data.fromTime ? Gen.getTimeZoneInMinutesFromString(data.fromTime) : Constants.MINIMUM_TIMEZONE, data.toTime ? Gen.getTimeZoneInMinutesFromString(data.toTime): Constants.MAXIMUM_TIMEZONE];

        this.props.applyFilter(dataCopy);
    }

    render(){

        const {handleSubmit} = this.props;
        return(
            <div className="form-wrapper form_wrap">
                <form className="filter-container" onSubmit={handleSubmit(this.submit.bind(this))} >

                <div className="form_row">
                    <Field
                        name="name"
                        component={renderTextField}
                        label="name:"
                        placeholder="Name"
                    />
                </div>

                <div className="form_row">
                    <Field
                        name="city"
                        component={renderTextField}
                        label="city:"
                        placeholder="City"
                    />
                </div>

                <div className="form_row">
                    <Field
                        name="fromTime"
                        component={renderTextField}
                        placeholder="+HH:MM / -HH:MM"
                        label="from timezone:"
                    />
                </div>

                <div className="form_row">
                    <Field
                        name="toTime"
                        component={renderTextField}
                        placeholder="+HH:MM / -HH:MM"
                        label="to timezone:"
                    />
                </div>

                <div className="filter-button form_buttons">
                    <LaddaButton
                        type="submit"
                        className="btn btn-add first"
                        data-color="#eee"
                        data-size={XL}
                        data-style={SLIDE_UP}
                        data-spinner-size={30}
                        data-spinner-color="#ddd"
                        data-spinner-lines={12}
                    >
                        Apply
                    </LaddaButton>
                </div>

            </form>
            </div>
        )
    };
}

Filter.proptypes = {
    applyFilter: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    userId: PropTypes.number,
}

Filter = reduxForm({
    form: 'filterForm',
    validate,
    enableReinitialize: true,
})(Filter);

export default Filter;

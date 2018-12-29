import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import {notify} from 'react-notify-toast';
import {Field, reduxForm} from 'redux-form';
import {validate_timezone as validate} from './../common/forms/validation';
import {renderTextField} from './../common/forms/input-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import axiosInstance from '../client';
import {CREATE_TIMEZONE_ENDPOINT, UPDATE_TIMEZONE_ENDPOINT} from "../endpoints";
import LaddaButton, {SLIDE_UP, XL} from "react-ladda";
import {clearTimeZoneData, fetchTimeZoneAction} from "../actions";
import {connect} from "react-redux";
import {Gen} from "../helpers/gen";

class AddTimezonePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showForm: true,
            initialized: false,
        };
    }

    getPageType() {
        const id = this.props.match.params.id || null;
        return id ? "Edit" : "Create";
    }

    componentWillMount() {
        const id = this.props.match.params.id || null;
        if(id) {
            this.props.fetchTimeZoneAction(id);
        } else {
            this.props.clearTimeZoneData();
        }
    }

    toggle() {
        this.setState({
            loading: !this.state.loading,
            progress: 0.5,
            showForm: this.state.showForm,
            initialized: this.state.initialized,
        });
    }

    submit(data){
        this.toggle();
        console.log(data);
        let {name, city, GMTDifference} = data;

        const id = this.props.match.params.id || null;
        GMTDifference = Gen.getTimeZoneInMinutesFromString(GMTDifference);
        const endpoint = this.getPageType() === "Edit" ? UPDATE_TIMEZONE_ENDPOINT + "/" + id : CREATE_TIMEZONE_ENDPOINT;

        const postData = {id, name, city, GMTDifference};

        if(this.getPageType() === "Edit") {
            axiosInstance.put(endpoint, postData)
                .then((success) => {
                    console.log(success.data.success.message);
                    notify.show(success.data.success.message, 'success');
                    this.setState({
                        loading: false,
                        showForm: false,
                    })
                })
                .catch((error) => {
                    console.log(error.response.data.error.message);
                    notify.show(error.response.data.error.message, 'error');
                })
                .finally(() => {
                    this.toggle();
                });
        } else {
            axiosInstance.post(endpoint, postData)
                .then((success) => {
                    console.log(success.data.success.message);
                    notify.show(success.data.success.message, 'success');
                    this.setState({
                        loading: false,
                        showForm: false,
                    })
                })
                .catch((error) => {
                    console.log(error.message);
                    notify.show(error.message, 'error');
                })
                .finally(() => {
                    this.toggle();
                });
        }
  }

  head(){
    return (
        <Helmet bodyAttributes={{class: "contactPage"}}>
          <title>{`Add/Edit Timezone`}</title>
        </Helmet>
    );
  }

    render() {

      const { handleSubmit, timezoneData } = this.props;
      const pageType = this.getPageType();

      if((pageType === 'Edit' && !timezoneData)) {
          return null;
      }

      return (

          <section className="contactPage_wrap">
          {this.head()}
            <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
            <div className="main anim-appear">
                  <div className="grid">
                      <div className="column column_12_12">
                        <div className="content_block">
                            {
                                !this.state.showForm ? <div className="confirm_email_block">
                                    <div className="confirm_email_check">
                                        Resource created/updated successfully
                                    </div>
                                    <Link className="proceed-to-link" to="/">Proceed to timezones page</Link>

                                </div>: <form className="add-timezone-container" onSubmit={handleSubmit(this.submit.bind(this))}>

                                    <div className="form_wrap">

                                        <div className="form_row">
                                            <Field
                                                name="name"
                                                component={renderTextField}
                                                label="Name:"
                                                placeholder="Name"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="city"
                                                component={renderTextField}
                                                label="City:"
                                                placeholder="City"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="GMTDifference"
                                                component={renderTextField}
                                                label="GMT Offset"
                                                placeholder="+HH:MM / -HH:MM"
                                            />
                                        </div>

                                        <div className="form_buttons">
                                            <LaddaButton
                                                type="submit"
                                                className="btn btn-add first"
                                                loading={this.state.loading}
                                                data-color="#eee"
                                                data-size={XL}
                                                data-style={SLIDE_UP}
                                                data-spinner-size={30}
                                                data-spinner-color="#ddd"
                                                data-spinner-lines={12}
                                            >
                                                {pageType} timezone
                                            </LaddaButton>
                                        </div>
                                    </div>
                                </form>
                            }
                        </div>
                      </div>
                  </div>
              </div>
              </ReactCSSTransitionGroup>
          </section>
      );
    }
  }

function mapStateToProps(state){
    return {
        timezoneData: Object.assign({}, {...state.timezone}, {GMTDifference: state.timezone && Gen.getFormattedGMTDifference(state.timezone.GMTDifference)}),
        initialValues: Object.assign({}, {...state.timezone}, {GMTDifference: state.timezone && Gen.getFormattedGMTDifference(state.timezone.GMTDifference)}),
    };
}

AddTimezonePage = reduxForm({
      form: 'timezoneForm',
      validate,
      enableReinitialize: true,
})(AddTimezonePage);

export default {
    component: connect(mapStateToProps, { fetchTimeZoneAction, clearTimeZoneData })(AddTimezonePage)
};

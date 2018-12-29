import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Helmet} from 'react-helmet';
import InfoBlock from '../components/infoBlock';
import {clearTimeZoneData, fetchTimeZoneAction} from "../actions";
import {Col, Grid, Row} from 'react-bootstrap';
import axiosInstance from '../client';
import {Gen} from "../helpers/gen";
import {Link, withRouter} from "react-router-dom";
import {DELETE_TIMEZONE_ENDPOINT} from "../endpoints";
import {notify} from "react-notify-toast";

class Timezone extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTime: ''
        }
    }
    componentDidMount(){
        console.log(this.props);
        this.props.fetchTimeZoneAction(this.props.match.params.id);

        setInterval(() => {
            this.setState({
                currentTime: Gen.getCurrentTimeinTimeZone(this.props.timezoneData.GMTDifference)
            })
        }, 1000);
    }
    componentWillUnmount(){
        this.props.clearTimeZoneData();
    }
    deleteTimeZone() {
        axiosInstance.delete(DELETE_TIMEZONE_ENDPOINT + "/" + this.props.match.params.id)
            .then((success) => {
                console.log(success.data.success.message);
                notify.show(success.data.success.message, 'success');
                this.props.history.push(`/timezones`);
            })
            .catch((error) => {
                console.log(error.response.data.error.message);
                notify.show(error.response.data.error.message, 'error');
            });
    }

    render() {
        if(this.props.timezoneData){
            const {id, name, UserId, city, GMTDifference, createdAt, updatedAt} = this.props.timezoneData;
            const {currentTime} = this.state;
            return(
                <div className="timezone-page">
                    <Helmet bodyAttributes={{class: "postPage"}}>
                        <city>{`Name: ${name}`}</city>
                    </Helmet>
                    {/*<InternalTextBanner Heading={this.props.timezoneData.title} wrapperClass="post" />*/}
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                    <div className="main anim-appear">
                        <div className="grid">
                            <div className="column column_12_12">
                                <div className="post">
                                    <Grid>
                                        <Row className="title-row">
                                            {
                                                <div><Link className="right-align" to={`/timezone/edit/${id}`}>Edit this timezone</Link>
                                                    <div className="delete-timezone" onClick={this.deleteTimeZone.bind(this)}>
                                                        Delete
                                                    </div>
                                                </div>
                                            }
                                        </Row>
                                        <Row className="bottom-line-separator">
                                            <Col xs={12} md={6}>
                                                <Row>
                                                    <Col xs={6}>
                                                        <Link to={`/user/${UserId}`} >See User Profile </Link>
                                                    </Col>

                                                </Row>

                                                <Row>
                                                    <Col xs={6} >
                                                        <InfoBlock heading="Name" info={name} />
                                                    </Col>

                                                </Row>
                                                <Row>
                                                    <Col xs={6} >
                                                        <InfoBlock heading="City" info={city} />
                                                    </Col>
                                                    <Col xs={6}>
                                                        <InfoBlock heading="Created At" info={Gen.getDateFromISODate(createdAt)}/>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={6} >
                                                        <InfoBlock heading="Browser's time difference" info={Gen.getTimeZoneDifferenceFromBrowser(GMTDifference)} />
                                                    </Col>

                                                    <Col xs={6} >
                                                        <InfoBlock heading="Timezone" info={"GMT " + Gen.getFormattedGMTDifference(GMTDifference)} />
                                                    </Col>
                                                </Row>

                                                <InfoBlock heading="Time ticker" info={currentTime} isBig={true} />

                                            </Col>

                                        </Row>
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                    </ReactCSSTransitionGroup>
                </div>
            );
        } else {
            return (
                <div className="timezone-page">
                    <Helmet bodyAttributes={{class: "postPage"}}>
                        <title>{'Timezone Page'}</title>
                    </Helmet>
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                    <div className="main anim-appear">
                        <div className="grid">
                            <div className="column column_12_12">
                                <div className="post">

                                </div>
                            </div>
                        </div>
                    </div>
                    </ReactCSSTransitionGroup>
                </div>
            );
        }
    }
  }

function mapStateToProps(state){
    return {
        timezoneData: state.timezone,
    };
}
function loadData(store, landingPageID){
    return store.dispatch(fetchTimeZoneAction(landingPageID));
}

export default {
    loadData,
    component: withRouter(connect(mapStateToProps, { fetchTimeZoneAction, clearTimeZoneData })(Timezone))
};


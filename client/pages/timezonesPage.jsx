import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Col, Grid, Row} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InternalTextBanner from '../components/banners/internalTextBanner';
import {clearNextUrl, fetchTimeZonesAction} from '../actions';
import {Helmet} from 'react-helmet';
import TimeZoneCard from "../components/timezoneCard";
import Filter from "../components/filter";

class Timezones extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showFilterOnMobile: false,
            filters: {}
        };
    }

    componentDidMount(){
        this.props.clearNextUrl();
        const id = this.props.match.params.id;
        if(id)
            this.props.fetchTimeZonesAction({UserId: [id]});
        else
            this.props.fetchTimeZonesAction();

    }

    loadMoreClicked() {
        console.log("load more clicked")
        this.props.fetchTimeZonesAction(this.state.filters);
    }

    renderTimeZones() {
        if (this.props.timezones !== false) {
            const timezonesData = this.props.timezones.map((timezone, index) => {
                return (
                    <div key={index} className="timezone">
                        <TimeZoneCard timezone={timezone}/>
                    </div>
                );
            });

            return (<div>
                {timezonesData}
                    <div className={`${this.props.nextUrl ? '' : 'hidden'} load-more-container`}>
                        <div className="load-more" onClick={this.loadMoreClicked.bind(this)}> Load more</div>
                    </div>
                </div>
            );
        }
    }

    showFilter() {
        this.setState({
            showFilterOnMobile: true,
            filters: this.state.filters
        })
    }

    hideFilter() {
        this.setState({
            showFilterOnMobile: false,
            filters: this.state.filters
        })
    }

    head(){
        return (
            <Helmet bodyAttributes={{class: "postsPage"}}>
                <title>{`Timezones Page`}</title>
            </Helmet>
        );
    }

    fetchTimeZoneAndHideFilterOnMobile(data) {
        this.props.clearNextUrl();
        this.props.fetchTimeZonesAction(data);
        this.setState({
            showFilterOnMobile: false,
            filters: data
        })
    }


    render() {

        const {timezones} = this.props;
        const userId = this.props.match.params.id;
        if(this.props.timezones){
            return(
                <div className="timezones-page">
                    {this.head()}
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                    <div className="main anim-appear">
                        <Grid className="timezones">

                            <div className={`${this.state.showFilterOnMobile ? 'mobile-hidden' : 'mobile-displayed'} show-filter-button`} onClick={this.showFilter.bind(this)}>
                                filter
                            </div>

                            <Row>
                                <Col className={`${!this.state.showFilterOnMobile ? 'mobile-hidden' : 'mobile-displayed'}`} xs={12} md={4}>
                                    <Filter user={this.props.user} applyFilter={this.fetchTimeZoneAndHideFilterOnMobile.bind(this)} userId={userId ? userId: ''} />
                                </Col>
                                <Col className={`${this.state.showFilterOnMobile ? 'mobile-hidden' : 'mobile-displayed'}`} xs={12} md={8}>
                                    {
                                        (timezones.length > 0) ? this.renderTimeZones()
                                         :
                                           <div className="no-result">
                                            <h2> Oops!!! No timezones</h2>
                                            <h2> Try to widen your search</h2>
                                           </div>
                                    }
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                    </ReactCSSTransitionGroup>
                </div>
            );
        } else {
            return (
                <div>
                    {this.head()}
                    <InternalTextBanner Heading="" wrapperClass="posts" />
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                        <div className="main anim-appear">
                            <div className="grid">
                                <div className="column column_8_12">
                                    <div className="posts">

                                    </div>
                                </div>
                                <div className="column column_4_12">

                                </div>
                            </div>
                        </div>
                    </ReactCSSTransitionGroup>
                </div>);
        }
  }
}

function mapStateToProps(state){
    return {
        timezones: state.timezones.arr,
        nextUrl: state.timezones.nextUrl,
        user: state.user,
    };
};

function loadData(store){
    return store.dispatch(fetchTimeZonesAction());
}

export default {
    loadData,
    component: connect(mapStateToProps, { fetchTimeZonesAction, clearNextUrl })(Timezones)
};


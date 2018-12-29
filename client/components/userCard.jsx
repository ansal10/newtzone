import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Col, Row} from 'react-bootstrap';
import {withRouter} from 'react-router-dom'
import {Gen} from "../helpers/gen";

class UserCard extends Component {

    timezoneClicked() {
        this.props.history.push(`/user/${this.props.user.id}`);
    }

    render(){
        const {id, email, name, sex, role, status, createdAt, updatedAt} = this.props.user;
        return(
            <Row className="timezone-card-container" onClick={this.timezoneClicked.bind(this)}>
                <Col className="timezone-image-container" xs={4} md={3}>
                    <img className="timezone-image" src="https://www.mykhel.com/thumb/247x100x233/cricket/players/9/11419..jpg" />
                </Col>

                <Col className="timezone-info-container" xs={8} md={9}>
                    <div className="timezone-title" >
                        {name}
                    </div>
                    <div className="timezone-class">
                        {`sex: ${sex} `}
                    </div>
                    <div className="timezone-class">
                        {`role: ${role} `}
                    </div>
                    <div className={`${status === 'active' ? 'green' : 'red'} timezone-class`}>
                        {`status: ${status} `}
                    </div>

                    <Row>
                        <Col xs={6} className="timezone-area">
                            {email}
                        </Col>
                        <Col xs={6} className="timezone-rate">
                            {`createdAt: ${Gen.getDateFromISODate(createdAt)}`}
                        </Col>
                    </Row>
                    <div className="timezone-sts">
                        {`updatedAt: ${Gen.getDateFromISODate(updatedAt)}`}
                    </div>
                </Col>
            </Row>
        )
    };
}

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
}

export default withRouter(UserCard);

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { Gen } from "../helpers/gen";


class TimezoneCard extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			currentTime: ''
		}
	}

	componentDidMount() {
		setInterval(() => {
			this.setState({
				currentTime: Gen.getCurrentTimeinTimeZone(this.props.timezone.GMTDifference)
			})
		}, 1000);
	}

	timezoneClicked() {
		this.props.history.push( `/timezone/${this.props.timezone.id}` );
	}

	render() {
		const { id, name, UserId, city, GMTDifference, createdAt, updatedAt } = this.props.timezone;
		const {currentTime} = this.state;
		return (
			<Row className="timezone-card-container" onClick={this.timezoneClicked.bind( this )}>
				<Col className="timezone-image-container" xs={3} md={3}>
					<img alt="globe" className="timezone-image" src={`/assets/graphics/globe.png`}/>
				</Col>

				<Col className="timezone-info-container" xs={6} md={6}>
					<div className="timezone-title">
						Name: {name}
					</div>
					<div className="timezone-class">
						Created at: { Gen.getDateFromISODate(createdAt) }
					</div>
					<Row>
						<Col xs={6} className="timezone-area">
							City: {city}
						</Col>
					</Row>

					<div className="timezone-sts">
						Time ticker: {currentTime}
					</div>

					<div className="timezone-class">
						GMT {Gen.getFormattedGMTDifference(GMTDifference)}
					</div>

					<div className="timezone-class">
						{Gen.getTimeZoneDifferenceFromBrowser(GMTDifference)}
					</div>
				</Col>

				<Col className="arrow" xs={3} md={3}>
					<img className="arrow-indicator"
					     src={Gen.isGreen( GMTDifference ) ? "/assets/graphics/down-arrow.png" : "/assets/graphics/up-arrow.png"} alt='up/down'/>
				</Col>
			</Row>
		);
	};
}

TimezoneCard.propTypes = {
	timezone: PropTypes.object.isRequired
};

export default withRouter( TimezoneCard );

/* eslint-disable react/prop-types */
import React from 'react'
import { withRouter } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import { IconContext } from "react-icons";
import { MdShare } from 'react-icons/md';
import PropTypes from 'prop-types'
import Media from 'react-media';

import '../component.css'
import ShareModalComponent from '../share/ShareModalComponent'
import { getSectionClassName } from '../Utilties'

class NewsCardComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        }
    }
    sectionName = this.props.section.toUpperCase()
    sectionClass = getSectionClassName(this.sectionName)
    basicClass = "section-basic"

    handleClick = (url) => {
        this.props.history.push({
            pathname: '/article',
            search: '?id=' + url,
            state: {
                isGuardian: this.props.isGuardian,
                section: this.sectionName,
            }
        })
    }
    handleModalOpen = (e) => {
        e.stopPropagation();
        this.setState(() => {
            return {
                show: true
            }
        })
    }
    handleModalClose = () => {
        this.setState(() => {
            return {
                show: false
            }
        })
    }
    render() {
        return (
            <>
                <ShareModalComponent show={this.state.show} handleModalClose={() => this.handleModalClose()} title={this.props.title} link={this.props.link} className="modal-width" />
                <Media queries={{
                        small: "(max-width: 410px)",
                        large: "(min-width: 411px)"
                    }}>
                {
                   matches =>  
                   <Container fluid key={this.props.id} className={matches.small ? "news-card news-card-small" : "news-card news-card-large"} onClick={() => this.handleClick(this.props.id)}>
                    <Row className="news-card-row">
                        <Col md={12} lg={3}>
                            <Image src={this.props.imgUrl} alt="news img" thumbnail />
                        </Col>
                        <Col md={12} lg={9} className="news-card-text-area">
                            <p className="news-card-title">{this.props.title}
                                <IconContext.Provider value={{ size: "20px" }}>
                                    <MdShare onClick={(e) => this.handleModalOpen(e)} />
                                </IconContext.Provider>
                            </p>
                            <p className="news-card-desc">{this.props.description}</p>
                            <Row>
                                <Col xs={5} md={5}><span className="news-card-date">{this.props.date}</span></Col>
                                <Col xs={7} md={7} className="section-right-padding"><span className={`${this.sectionClass} ${this.basicClass}`}>{this.sectionName}</span></Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                }
                </Media>
                
            </>
        )
    }
}
NewsCardComponent.propTypes = {
    section: PropTypes.string.isRequired,
    isGuardian: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    imgUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    link: PropTypes.string.isRequired,
}
export default withRouter(NewsCardComponent)
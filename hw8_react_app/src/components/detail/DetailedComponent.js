/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { Fragment } from 'react'
import Collapse from 'react-bootstrap/Collapse'
import { IconContext } from "react-icons";
import { FaChevronDown, FaChevronUp, FaRegBookmark, FaBookmark } from 'react-icons/fa'
import ReactTooltip from 'react-tooltip'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Zoom } from 'react-toastify';
import Media from 'react-media'
import PropTypes from 'prop-types'
import { format } from 'date-fns'

import { formatDescription} from '../Utilties'
import CommentBoxComponent from '../commentbox/CommentBoxComponent'
import LoadingComponent from '../loader/LoadingComponent'
import FbShareComponent from '../share/FbShareComponent';
import TwitterShareComponent from '../share/TwitterShareComponent'
import EmailShareComponent from '../share/EmailShareComponent'
import { Element, Events, animateScroll as scroll, scroller } from 'react-scroll'

const axios = require('axios')
const localStorage = window.localStorage;


class DetailedComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isGuardian: this.props.history.location.state.isGuardian,
            detailsUrl: this.props.location.search.substring(4),
            extended: false,
            result: null,
            bookmarked: false,
        }
    }
    
    componentDidMount() {
        const baseUrl = "https://shrav280805node.appspot.com/"
        const detailType = this.state.isGuardian ? 'guardianDetail/' : 'nytDetail/'
        axios((baseUrl + detailType + this.state.detailsUrl))
        .then((response) => {
            console.log(response.data[0])
            this.setState({
                result: response.data[0]
            })
        })
        Events.scrollEvent.register('begin', function(to, element) {
        });
    
        Events.scrollEvent.register('end', function(to, element) {
        });
    }
    componentDidUpdate() {
        ReactTooltip.rebuild();
    }
    componentWillUnmount() {
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
    }
    handleClick(type) {
        if (type === "down") {
            this.setState((prevState) => {
                return {
                    extended: !prevState.extended,
                }
            })
            scroller.scrollTo('advancedDesc', {
                duration : 500,
                smooth : true,
            })
        }
        else if (type === "up") {
            setTimeout(() => {
                this.setState((prevState) => {
                    return {
                        extended: !prevState.extended,
                    }
                })
            }, 1000);
            this.props.handleUpArrowClick();
        }
    }
    addToFavorites = () => {
        ReactTooltip.hide();
        let articleList = JSON.parse(localStorage.getItem('favoriteArticles'));
        const articleKey = this.state.result.id.toString()
        // add to localstorage
        let newsObj = _.cloneDeep(this.state.result)
        newsObj['isGuardian'] = this.state.isGuardian
        newsObj['section'] = this.state.result.section
        delete newsObj.description
        localStorage.setItem(articleKey, JSON.stringify(newsObj))
        // add to array
        if (articleList === undefined || articleList === null) {
            articleList = [];
        }
        articleList.push(articleKey)
        localStorage.setItem('favoriteArticles', JSON.stringify(articleList))
        this.setState({
            bookmarked: true,
        })
        toast("Saving " + this.state.result.title, {
            className: 'font-black'
        });
    }
    removeFromFavorites = () => {
        ReactTooltip.hide()
        let articleList = JSON.parse(localStorage.getItem('favoriteArticles'));
        const articleKey = this.state.result.id.toString()
        // remove from array
        const index = articleList.indexOf(articleKey);
        if (index !== -1) articleList.splice(index, 1);
        localStorage.setItem('favoriteArticles', JSON.stringify(articleList))
        // remove from localstorage
        localStorage.removeItem(articleKey)
        this.setState({
            bookmarked: false,
        })
        toast("Removing - " + this.state.result.title, {
            className: 'font-black'
        });
    }
    render() {
        if (this.state.result !== undefined && this.state.result !== null && this.state.result.length !== 0) {
            var date = format(new Date(this.state.result.date), 'd MMMM yyyy')
            var [basicDesc, advancedDesc] = formatDescription(this.state.result.description)
            var idVal = this.state.result.id.toString();
        }

        return (
            <div>
                <ToastContainer position={toast.POSITION.TOP_CENTER} transition={Zoom} autoclose={3000} hideProgressBar={true} className={"toast-message"} closeOnClick={false} />
                {
                    this.state.result === null
                    ?
                    <LoadingComponent />
                    :
                    <>
                    {
                        Object.keys(this.state.result).length === 0
                        ?
                        <div className="no-results">Sorry, can not fetch the detiled article as it is missing a few keys in backend.</div>
                        :
                        <div>
                        <Container fluid className="detialed">
                                <Row className="detailed-title detailed-cursor">
                                    <Col>{this.state.result.title}</Col>
                                </Row>
                            <Row className="bottom-padding">
                                <Col xs={5} md={4} lg={2} className="detailed-card-date detailed-cursor">{date}</Col>
                                <Col xs={4} md={6} lg={9} className="detailed-share detailed-cursor">
                                    <FbShareComponent newsUrl={this.state.result.link} size={27} className={"share-buttons"} /><ReactTooltip id="tooltip-facebook" place={"top"} effect={"solid"} />
                                    <TwitterShareComponent newsUrl={this.state.result.link} size={27} className={"share-buttons"} /><ReactTooltip id="tooltip-twitter" place={"top"} effect={"solid"} />
                                    <EmailShareComponent newsUrl={this.state.result.link} size={27} className={"share-buttons"} /><ReactTooltip id="tooltip-email" place={"top"} effect={"solid"} />
                                </Col>
                                <Col xs={3} md={2} lg={1} className="detailed-cursor">
                                    {
                                        localStorage.getItem(idVal) !== null || this.state.bookmarked === true
                                        ?
                                        <span className="detailed-right bookmark-right-padding">
                                            <IconContext.Provider value={{ size: "24px", color: "red" }}>
                                                <FaBookmark onClick={() => this.removeFromFavorites()} data-tip="Bookmark" data-for="tooltip-bookmarked" data-class="padding" /><ReactTooltip id="tooltip-bookmarked" place={"top"} effect={"solid"} />
                                            </IconContext.Provider>
                                        </span>

                                        :
                                        <span className="detailed-right bookmark-right-padding">
                                            <IconContext.Provider value={{ size: "24px", color: "red" }}>
                                                <FaRegBookmark onClick={() => this.addToFavorites()} data-tip="Bookmark" data-for="tooltip-bookmark" data-class="padding" /><ReactTooltip id="tooltip-bookmark" place={"top"} effect={"solid"} />
                                            </IconContext.Provider>
                                        </span>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col><img className="detailed-image detailed-cursor" src={this.state.result.image} alt="detailed page" /></Col>
                            </Row>
                            <Row className="detailed-desc">
                                <Col>

                                    <span className="detailed-cursor" >{basicDesc}</span><span>{this.state.extended ? `` : `...`}</span>
                                    <Element name="advancedDesc">
                                    <Collapse in={this.state.extended}>
                                            <span className="detailed-desc-adv"><br />{advancedDesc}</span>
                                        </Collapse>
                                    </Element>
                                    <br />
                                    {
                                        advancedDesc !== undefined && advancedDesc !== null && advancedDesc.length !== 0
                                        ?
                                        (
                                            this.state.extended
                                                ?
                                                <IconContext.Provider value={{ size: "1em" }} >
                                                    <FaChevronUp onClick={this.handleClick.bind(this, "up")} className="extend-right" />
                                                </IconContext.Provider>
                                                :
                                                <IconContext.Provider value={{ size: "1em" }} className="extend-right">
                                                    <FaChevronDown onClick={this.handleClick.bind(this, "down")} className="extend-right" />
                                                </IconContext.Provider>
                                        )
                                        :
                                        <></>
                                    }
                                </Col>
                            </Row>
                        </Container>
                        <Container fluid>
                            <Row>
                                <Col md={12}><CommentBoxComponent newsId={this.state.result.id} /></Col>
                            </Row>
                        </Container>
                    </div>
                    }
                    </>
                }
            </div>
        )
    }
}

DetailedComponent.propTypes = {
    history : PropTypes.object.isRequired,
    location : PropTypes.object.isRequired,
    handleUpArrowClick : PropTypes.func.isRequired,
}

export default DetailedComponent
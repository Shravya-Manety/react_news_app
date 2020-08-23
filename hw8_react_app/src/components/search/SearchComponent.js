import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import SearchCardComponent from './SearchCardComponent'
import { format } from 'date-fns'
import LoadingComponent from '../loader/LoadingComponent'

const axios = require('axios')
const baseUrl = "https://shrav280805node.appspot.com/"

class SearchComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            searchValue: this.props.searchValue,
            guardianRes: {},
            nytRes: {},
            searchReq: true
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.searchValue !== nextProps.searchValue) {
            this.setState({
                searchValue: nextProps.searchValue,
                guardianRes: {},
                nytRes: {},
                searchReq: true,
            })
        }
    }
    // static getDerivedStateFromProps(props, nextProps){
    //     if (props.searchValue !== nextProps.searchValue){
    //         return({
    //             searchValue: nextProps.searchValue,
    //             searchReq: true,
    //         })
    //     }
    //     return null
    // }
    componentDidUpdate() {
        if (this.state.searchReq) {
            this.makeGuardianAPICall()
            this.makeNytAPICall()
            this.setState({
                searchReq: false,
            })
        }
    }
    componentDidMount() {
        this.makeGuardianAPICall()
        this.makeNytAPICall()
        this.setState({
            searchReq: false,
        })
    }
    makeNytAPICall() {
        axios(baseUrl + "nytSearch/" + this.state.searchValue)
            .then(response => {
                this.setState({
                    nytRes: response.data
                })
            })
    }
    makeGuardianAPICall() {
        axios(baseUrl + "guardianSearch/" + this.state.searchValue)
            .then(response => {
                this.setState({
                    guardianRes: response.data
                })
            })
    }

    render() {
        const guardianResState = this.state.guardianRes;
        const nytResState = this.state.nytRes
        if (guardianResState instanceof Array && guardianResState.length > 0) {
            var listOfNews = guardianResState.map((newsItem) => {
                const date = format(new Date(newsItem.date), 'yyyy-MM-dd')
                return <Col md={6} lg={3} key={newsItem.id}><SearchCardComponent id={newsItem.id} isGuardian={true} title={newsItem.title + " "} date={date} section={newsItem.section} imgUrl={newsItem.image} link={newsItem.link} /></Col>
            })
        }
        else {
            listOfNews = [];
        }
        if (nytResState instanceof Array && nytResState.length > 0) {

            var tempListOfNews = Array.isArray(nytResState) && nytResState.map((newsItem) => {
                const date = format(new Date(newsItem.date), 'yyyy-MM-dd')
                return <Col md={6} lg={3} key={newsItem.link}><SearchCardComponent id={newsItem.link} isGuardian={false} title={newsItem.title + " "} date={date} section={newsItem.section} imgUrl={newsItem.image} link={newsItem.link} /></Col>
            })
        }
        if (listOfNews !== undefined && listOfNews !== null && tempListOfNews !== undefined && tempListOfNews !== null) {
            listOfNews.push.apply(listOfNews, tempListOfNews)
        }
        return (
            <>
                {
                    guardianResState instanceof Array && nytResState instanceof Array
                        ?
                        <Container fluid>
                            {
                                (guardianResState.length === 0) && (nytResState.length === 0)
                                    ?
                                    <Col className="no-results">No Results</Col>
                                    :
                                    <>
                                        <Row>
                                            <Col className="search-results">Results</Col>
                                        </Row>
                                        <Row>
                                            {listOfNews}
                                        </Row>
                                    </>
                            }

                        </Container>
                        :
                        <LoadingComponent />
                }
            </>
        )
    }
}
SearchComponent.propTypes = {
    searchValue: PropTypes.string.isRequired,
}
export default SearchComponent
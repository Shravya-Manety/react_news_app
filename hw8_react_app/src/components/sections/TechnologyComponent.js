import React from 'react'
import NewsCardComponent from './NewsCardComponent'
import LoadingComponent from '../loader/LoadingComponent'
import PropTypes from 'prop-types'
import { format } from 'date-fns'

const axios = require('axios')

class TechnologyComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            news: [],
        }
    }
    componentDidUpdate(prevProps){
        if(this.props.isGuardian !== prevProps.isGuardian){
            this.makeAPICall()
            this.setState({
                news : [],
            })
        }
    }
    componentDidMount() {
        this.makeAPICall()
    }
    makeAPICall() {
        const baseUrl = "https://shrav280805node.appspot.com/"
        const newsType = this.props.isGuardian ? "guardian" : "nyt"
        axios(baseUrl + newsType + "Tech")
            .then(response => {
                this.setState({
                    news: response.data
                })
            })
    }

    render() {
        const listOfNewsCards = this.state.news.map((newsItem) => {
            let date = format(new Date(newsItem.date), 'yyyy-MM-dd')
            const keyValue = this.props.isGuardian ? newsItem.id : newsItem.link 
            return <NewsCardComponent key={keyValue} isGuardian={this.props.isGuardian} id={keyValue} imgUrl={newsItem.image} title={newsItem.title} date={date} section={newsItem.section} description={newsItem.description} link = {newsItem.link}/>
        })
        return (
            <>
            {
                this.state.news.length === 0
                ?
                <LoadingComponent />
                :
                [listOfNewsCards]}
            </>
        )
    }
}
TechnologyComponent.propTypes = {
    isGuardian : PropTypes.bool.isRequired,
}

export default TechnologyComponent
import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as actions from '../../actions/actions'
import { withRouter } from 'react-router-dom';



class PopupWithFunctions extends Component {
    constructor(){
        super()
        this.state = {

        }
    }
    componentWillMount(){
        setTimeout(() => {
                this.setState({
                    loaded:true
                })
        }, 20);
    }

    close = () => {
        this.setState({
            loaded:false
        })
        setTimeout(() => {
            this.props.setDataToGlobalReducer('popup_options', false)
        }, 200);
       
    }
    render() {
        const {popup_options} = this.props.global
        const {loaded} = this.state

        return (
            <div 
           style ={{
               opacity:loaded ? 1 : 0,
               transition:'0.2s all'
           }} 
            className='popup__with__functions'>
                    <section className="overlay"
                    onClick = {() => this.close()}
                    ></section>
                    <div className='popup__content'>
                        <ul>
                        {
                            popup_options && popup_options.length > 0 ?
                            popup_options.map((option,i) => {
                                let func = option.func
                                return <li
                                className='flex__center'
                                key = {i}
                                onClick = {() => func()}
                                >
                                    {option.name}
                                </li>
                            })
                            :''
                        }
                        </ul>
                    </div>
            </div>
        );
    }
}

function mapStateToProps({ global }) {
    return { global }
  }
  
  export default withRouter(connect(mapStateToProps, actions)(PopupWithFunctions))
  
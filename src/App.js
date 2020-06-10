import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
//import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <AppMain title = "The Github Cards App" />
  );
}

//github usernames: gaearon, sophiebits, sebmarkbage, bvaughn

const CardList = (props) =>  (
  <div>
    {props.profiles.map(profile => <Card key={profile.id} {...profile} />)}
  </div>

);

class Form extends React.Component {

  state = {userName:''};

  handleSubmit = async (event) => {
    try {
          event.preventDefault();
          const resp = await axios.get(`https://api.github.com/users/${this.state.userName}`);

          this.props.onSubmit(resp.data);
          this.props.onError('');
          this.setState({userName : ''});
    }
    catch(error)
    {
      let errMsg = '';
      if(error.response)
      {
          // Request made and server responded
        console.log('Caught error in handleSubmit:' + error.response.data.message); // this is the main part. Use the response property from the error object
        errMsg = error.response.data.message;
      }
      else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        errMsg = 'Request could not be made';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        errMsg = error.message;
      }
      
      this.props.onError(errMsg);
    }
  };

  render()  {
    return (<form action="" onSubmit={this.handleSubmit}>
      <input type ="text=" placeholder="Enter github username" 
      value={this.state.userName}
      onChange={event => this.setState({userName : event.target.value})}
       required />
      <button> Add Card</button>
    </form>
    );
  }

}

class Card extends React.Component {
  
  render() {
    const profile = this.props;
    return(
      <div className="github-profile" >
        <img src={profile.avatar_url}></img>
        <div className="info" >
          <div className="name" >{profile.name}</div>
          <div className="company">{profile.company}</div>
        </div>
      </div>
    );

  }

}


class AppMain extends React.Component {

  state = {
      profiles: [],
      erorrMessage : ''
  };

  addNewProfile = (profileData) => {
    this.setState(prevState => ({
      profiles : [...prevState.profiles, profileData]
    }));
    
  };

  setErrorMessage = (errorMesg) => {
    this.setState(() => ({
      erorrMessage : errorMesg
    }));
  }
    
  render() {
    return (
      <div>
        {this.state.erorrMessage && <div className="error-message"> {this.state.erorrMessage}</div>}
        <div className="header"> {this.props.title}</div>
        <Form onSubmit={this.addNewProfile} onError={this.setErrorMessage} />
        <CardList  profiles={this.state.profiles}/>
      </div>
    );
  }
}

/*ReactDOM.render(
  <App title = "The Github Cards App" />,
  document.getElementById("root")
)*/

export default App;

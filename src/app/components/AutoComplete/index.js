import React from 'react'

export class AutoComplete extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: this.props.list,
            showDialog: false,
            selected_item: this.props.flag==1 ? sessionStorage.getItem('CIN') ? sessionStorage.getItem('CIN') :"" : this.props.flag==2 ? sessionStorage.getItem('SFHPID') ? sessionStorage.getItem('SFHPID') :"" :"",
            selected_SFHPID:  sessionStorage.getItem('SFHPID') ? sessionStorage.getItem('SFHPID') :"",
        }
    }

    renderAutoComplete = () => {
        return (
            <input className="form-control input-style-autocomplete" type="text"
                value={this.state.selected_item}
                onChange={(e) => this.handleInputChange(e)}
              
            />
        )
    }
    handleInputChange = (e) => {
        this.setState({
            selected_item: e.target.value,
            showDialog: e.target.value ? true : false
        }) 
     
        if(e.target.value=="")
        {
          if(this.props.flag==1)
          {           
            
          }
          else if(this.props.flag==2)
          {
          
          }
          this.props.renderMethod(this.props.flag);
        }
           this.props.onHandleChange(e)
    }

  

    renderDialog = () => {
        let list = this.props.list
         let row = []
        list.forEach(element => {
            row.push(
                <div className="dropdown-inner-item">
                    <a onClick={() => {
                        this.setState({
                            selected_item: element,
                            showDialog: false
                        })
                        this.props.onSelected(element)
                     
                    }}>
                        {element}
                    </a>
                </div>
            )
        });
        return (
            <div className="autocomplete-dropdown">
                {row}
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.props.list && this.props.list.length > 0 && this.state.showDialog ? this.renderDialog() : null}
                {this.renderAutoComplete()}
            </div>
        );
    }
}
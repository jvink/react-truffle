import React from 'react'

class betDetails extends React.Component{
    constructor(){
        super()
        this.state={
        }
    }

    render(){
        return(
            <div>
                <div className="flex">
                    <h2>Weddenschap details</h2>
                    <h2 className="XCursor" onClick={() => this.props.changecontent()}><i className="material-icons">clear</i></h2>
                </div>
                <div className="col-md-4 mb-3">
                    <label>Inzet</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                        </div>
                        <input type="number" className="form-control" disabled={true} placeholder="9" required />
                    </div>
                    <div className="form-group">
                        <label>Locatie</label>
                        <select className="form-control" disabled={true} onChange={this.onChangeCity}>
                        <option>Rotterdam</option>
                        <option>Amsterdam</option>
                        <option>Breda</option>
                        <option>Dordrecht</option>
                        <option>Groningen</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Datum</label>
                        <select className="form-control" disabled={true}>
                        <option>6-6-2019 12:00</option>
                        <option>7-6-2019 12:00</option>
                        <option>8-6-2019 12:00</option>
                        <option>9-6-2019 12:00</option>
                        </select>
                    </div>
                    <label>Resultaat:</label>
                    Verloren
                </div>
            </div>
        )
    }
}

export default betDetails
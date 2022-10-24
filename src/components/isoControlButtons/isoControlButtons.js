import './isoControlButtons.css'
import IsoTrackerLogo from "../../assets/images/IsoTracker.svg"

const IsoControlButtons = () => {

    return (
        <div >
            <div className="isotracker__column">
                <img src={IsoTrackerLogo} alt="isoTrackerLogo" className="isoTrackerLogo__image2"/>
            </div>
            
            <div className='all__buttons__iso__ctrl'>
                <div className='container__buttons__iso__ctrl'>
                    <a href='/' className='button__iso__ctrl'>
                        <center className='label__iso__ctrl'>
                            FEED
                        </center>
                        <center className='description__iso__ctrl'>
                            (Front end Engineering Design)
                        </center>
                        <p className='percentage__iso__ctrl'>
                            80%
                        </p>
                    </a>
                </div>
                <div className='container__buttons__iso__ctrl'>
                    <a href='/' className='button__iso__ctrl'>
                        <center className='label__iso__ctrl'>
                            IFD
                        </center>
                        <center className='description__iso__ctrl'>
                            (Issue for Design)
                        </center>
                        <p className='percentage__iso__ctrl'>
                            90%
                        </p>
                    </a>
                </div>
                <div className='container__buttons__iso__ctrl'>
                    <a href='/' className='button__iso__ctrl'>
                        <center className='label__iso__ctrl'>
                            IFC
                        </center>
                        <center className='description__iso__ctrl'>
                            (Issue for Construction)
                        </center>
                        <p className='percentage__iso__ctrl'>
                            85%
                        </p>
                    </a>
                </div>
            </div>

            <div className='container__progress__iso__ctrl'>
                <label className='progress__label__iso__ctrl'>
                    Total Progress: 75%
                </label>
                {/* <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                </div> */}
                <div className='container__progress'>
                    <div className="progress__images">
                        <div className="progress__value__images"><p className='percentage__progress'>75%</p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IsoControlButtons;
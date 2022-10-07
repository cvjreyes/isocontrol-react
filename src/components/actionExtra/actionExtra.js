//En la seccion de LDE/Isocontrol se requieren algunos campos extra para tratar los archivos

import './actionExtra.css'
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react'

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));


const ActionExtra = (props) =>{

    let today = new Date()
    today = today.getFullYear() + "-" + today.toLocaleString("en-US", { month: "2-digit" }) + "-" + today.toLocaleString("en-US", { day: "2-digit" })
    const [date, setDate] = useState(today);
    const [transmittal, setTransmittal] = useState("TRN001");

    async function handleTransmittalChange (event) {
      await setTransmittal(event.target.selectedOptions[0].label)
    }

    async function handleDateChange (event) {
      await setDate(event.target.value)
    }

    function toIssue() {
      props.toIssue(transmittal,date)
    }



    const classes = useStyles();
    return(
        <div className="actionExtra__container" >
            <select className="actionExtra__select" name="trn[]" onChange={handleTransmittalChange} ><option value="2" selected="selected">TRN001</option><option value="3">TRN002</option><option value="4">TRN003</option><option value="5">TRN004</option><option value="6">TRN005</option><option value="7">TRN006</option><option value="8">TRN007</option><option value="9">TRN008</option><option value="10">TRN009</option><option value="11">TRN010</option><option value="12">TRN011</option><option value="13">TRN012</option><option value="14">TRN013</option><option value="15">TRN014</option><option value="16">TRN015</option><option value="17">TRN016</option><option value="18">TRN017</option><option value="19">TRN018</option><option value="20">TRN019</option><option value="21">TRN020</option><option value="22">TRN021</option><option value="23">TRN022</option><option value="24">TRN023</option><option value="25">TRN024</option><option value="26">TRN025</option><option value="27">TRN026</option><option value="28">TRN027</option><option value="29">TRN028</option><option value="30">TRN029</option><option value="31">TRN030</option><option value="32">TRN031</option><option value="33">TRN032</option><option value="34">TRN033</option><option value="35">TRN034</option><option value="36">TRN035</option><option value="37">TRN036</option><option value="38">TRN037</option><option value="39">TRN038</option><option value="40">TRN039</option><option value="41">TRN040</option><option value="42">TRN041</option><option value="43">TRN042</option><option value="44">TRN043</option><option value="45">TRN044</option><option value="46">TRN045</option><option value="47">TRN046</option><option value="48">TRN047</option><option value="49">TRN048</option><option value="50">TRN049</option><option value="51">TRN050</option><option value="52">TRN051</option><option value="53">TRN052</option><option value="54">TRN053</option><option value="55">TRN054</option><option value="56">TRN055</option><option value="57">TRN056</option><option value="58">TRN057</option><option value="59">TRN058</option><option value="60">TRN059</option><option value="61">TRN060</option><option value="62">TRN061</option><option value="63">TRN062</option><option value="64">TRN063</option><option value="65">TRN064</option><option value="66">TRN065</option><option value="67">TRN066</option><option value="68">TRN067</option><option value="69">TRN068</option><option value="70">TRN069</option><option value="71">TRN070</option><option value="72">TRN071</option><option value="73">TRN072</option><option value="74">TRN073</option><option value="75">TRN074</option><option value="76">TRN075</option><option value="77">TRN076</option><option value="78">TRN077</option><option value="79">TRN078</option><option value="80">TRN079</option><option value="81">TRN080</option><option value="82">TRN081</option><option value="83">TRN082</option><option value="84">TRN083</option><option value="85">TRN084</option><option value="86">TRN085</option><option value="87">TRN086</option><option value="88">TRN087</option><option value="89">TRN088</option><option value="90">TRN089</option><option value="91">TRN090</option><option value="92">TRN091</option><option value="93">TRN092</option><option value="94">TRN093</option><option value="95">TRN094</option><option value="96">TRN095</option><option value="97">TRN096</option><option value="98">TRN097</option><option value="99">TRN098</option><option value="100">TRN099</option><option value="101">TRN100</option></select>
            <b className="actionExtra__text">Date:</b>
            <form className={classes.container} noValidate>
                <TextField
                    onChange={handleDateChange}
                    id="date"
                    type="date"
                    defaultValue={today}
                    className={classes.textField}
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                <button type="button" className="action__btn" name="date" value="date" onClick={toIssue}>To Issue</button>

            </form>

            
        </div>
    );
};

export default ActionExtra;

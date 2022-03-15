import React, {useState, useEffect} from "react"
import { Line } from 'react-chartjs-2'
import { useForm } from "react-hook-form"
import * as $ from 'jquery'
import './Productivity.css'

function daysInThisMonth() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth()+1,0).getDate();
}

const options = {
    scales: {
        yAxes: [
            {
                display: true,
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
};

const LineChart = () => {
    const initialArray = localStorage.getItem('datasets') ?
        (JSON.parse(localStorage.getItem("datasets")).arr) :
        (Array(daysInThisMonth()).fill(0));
    var month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'];
    var date = new Date();
    var month = month_names[date.getMonth()];
    const { register, handleSubmit, } = useForm();

    const [datasets, setDatasets] = useState(
        {
            label: 'Your Productivity',
            data: initialArray,
            fill: false,
            backgroundColor: 'rgb(60, 51, 92)',
            borderColor: 'rgba(60, 51, 92, 0.3)',
        },
    )
    const data = {
        labels: Array.from({length: daysInThisMonth()}, (_, i) => i+1),
        datasets: [datasets],
    };

    useEffect(() => {
        var array = { arr: datasets.data }
        window.localStorage.setItem('datasets', JSON.stringify(array))
    }, [datasets])

    const onSubmit = (d) => {
        var prodValues = data.datasets[0].data;
        prodValues[d.day-1]=d.prod;
        setDatasets({
            label: 'Your Productivity',
            data: prodValues,
            fill: false,
            backgroundColor: 'rgb(60, 51, 92)',
            borderColor: 'rgba(60, 51, 92, 0.3)',
        })
        $('#productivity-form').trigger("reset");
    }

    return (
        <div>
            <h2>Productivity for {month}</h2>
            <form noValidate id="productivity-form" onSubmit={handleSubmit(onSubmit)}>

                <input
                    placeholder="Enter Day Number"
                    name="day"
                    id="day-input"
                    type='number'
                    defaultValue={date.getDate()}
                    {...register("day", {
                        required: { value: true, message: "" },
                        min: { value: 1, message: "" },
                        max: { value: daysInThisMonth(), message: "" },
                    })} >
                </input>

                <input
                    placeholder="Productivity Value"
                    name="prod"
                    id="prod-input"
                    type='number'
                    {...register("prod", {
                        required: { value: true, message: "" },
                        min: { value: 0, message: "" },
                        max: { value: 10, message: "" },
                    })} >
                </input>

                <input type='submit' value='Submit'></input>

            </form>

            <Line data={data} options={options} />
        </div>
    )
}

export default LineChart
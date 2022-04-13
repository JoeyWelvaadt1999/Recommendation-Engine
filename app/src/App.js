import logo from './logo.svg';
import './App.css';
import { Grid, Typography, Card, CardHeader, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react';
import axios from 'axios'


const App = () => {
    const [rows, setRows] = useState([])
    const [cols, setCols] = useState([])

    const [profiles, setProfiles] = useState([])
    const [profile, setProfile] = useState()

    const [contentRecommendations, setContentRecommendations] = useState([])

    const handleChange = (e) => {

    }

    useEffect(() => {
        (async () => {
            await axios.get('http://localhost:3060/').then(res => res.data)
            .then(res => {
                setCols(Object.keys(res[0]).map((v, i) => {
                    return {
                        field: v,
                        headerName: v
                    }
                }))
                setRows(res)
            })

            // await axios.get('http://localhost:3060/profiles').then(res => res.data).then(res => setProfiles(res))
        })()
    }, [])

    console.log(profiles)
    return (
        <Grid container spacing={2} >
            <Grid item xs={10} sx={{margin: 0, padding: 0}}>
                <DataGrid sx={{height: '75vh', margin: 0}} rows={rows} columns={cols} onRowClick={(row) => {
                    console.log('click')
                    axios.get(`http://localhost:3060/${row.row.id}`).then(res => res.data).then(res => setContentRecommendations(res))
                }} />
            </Grid>
            <Grid item sm={2}>
                <FormControl fullWidth>
                    <InputLabel id="profile_select_label">Profile</InputLabel>
                    <Select
                        labelId="profile_select_label"
                        id="demo-simple-select"
                        value={profile}
                        label="Profile"
                        onChange={handleChange}
                    >
                        {profiles.map((v, i) => {
                            return (
                                <MenuItem key={i} value={v._id}>{v._id}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item sm={12} sx={{display:'flex', flexDirection: 'column'}} >
                <Typography variant='h5'>Content recommendations</Typography>
                <div style={{flexDirection: 'row', display: 'flex'}}>
                    {contentRecommendations.map((v, i) => {
                        return (
                            <Card>
                                <CardHeader title={v.name} subheader={v.brand + ' ' + v.category + ' ' + (parseInt(v.sellingprice) / 100)} />
                            </Card>
                        )
                    })}
                </div>
            </Grid>
        </Grid>
    )
}

export default App;

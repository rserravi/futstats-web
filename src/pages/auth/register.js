import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import { FormControl, FormHelperText, FormControlLabel, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { themeOptions } from 'src/theme/theme';
import { Copyright } from 'src/components/pageStruct/copyright';
import { strengthColor, strengthIndicator } from 'src/utils/password-strength';
import { userGoogleRegistrationAPI, userFormRegistrationApi } from 'src/api/userApi';
import { SET_AUTH_USER, SET_LOADING } from 'src/store/userSlice';
import Logo from 'src/ui-component/Logo';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';


const theme = createTheme(themeOptions);


export const RegisterPage = ({ ...others }) =>{
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(true);
    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();
    const [googleError, setGoogleError]= useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    const handleSubmit = async (event) => {
       // console.log("EN HANDLE SUBMINT", event);
        dispatch(SET_LOADING, true);
        await userFormRegistrationApi(event).then(result=>{
            if (result.status==='error'){
                setErrorMsg(result.message);
            } else {
               // console.log(result.result);
                dispatch(SET_AUTH_USER(result.result));
                navigate("/dashboard");
            }
        }
        ).catch(error =>{
            console.log(error);
            setGoogleError(error.message);
        });
                
      };

    // eslint-disable-next-line
    const handleGoogle = async (response) => {
        console.log("HANDLEGOOGLE1");
        await userGoogleRegistrationAPI(response).then(result=>{
            if (result.status==='error'){
                setErrorMsg(result.message);
                
            } else {
                //console.log(result.result);
                dispatch(SET_AUTH_USER(result.result));
                navigate("/dashboard");
            }
        }
        ).catch(error =>{
            console.log(error);
            setGoogleError(error.message);
        });
        
    };
    
    useEffect(() => {
        /* global google */
        const googleId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;
        if (window.google) {
            google.accounts.id.initialize({
                client_id: googleId,
                callback: handleGoogle
            });

            google.accounts.id.renderButton(document.getElementById('signUpDiv'), {
                //type: 'standard',
                theme: 'outline',
                // size: "small",
                text: 'signup_with',
                shape: 'square'
            });
            //google.accounts.id.prompt();
        }
    }, [handleGoogle]);

    useEffect(() => {
        changePassword('123456');
    }, []);
    
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >
                    <Logo />
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>

                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        >
                        <Grid item xs={12} sm={12} sx={{mt:5}}>
                            <Typography variant="body2">
                                If you have a Google / Gmail account, register here
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} sx={{mt:2}}>
                            <div id="signUpDiv" data-text="signup_with"></div>
                        </Grid>
                        <Grid item xs={12}>
                            {googleError!=='' && (
                                <>
                                    <FormHelperText error>{googleError}</FormHelperText>
                                    <Grid item>
                                        <Link href="/login" variant="bod2">
                                            Sign in
                                        </Link>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={12} sx={{mt:2}}>
                            <Typography variant="body2">
                            or sign up with Email address:
                            </Typography>
                        </Grid>
                    </Grid>

                    <Formik
                        initialValues={{
                            email:'',
                            firstname:'',
                            lastname:'',
                            password:''
                        }}
                        validationSchema={Yup.object().shape({
                            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                            password: Yup.string().max(255).required('Password is required')
                        })}
                        onSubmit={async (values, {setErrors, setStatus, setSubmitting }) =>{
                            try {
                                handleSubmit(values);
                                setStatus({success:true});
                                setSubmitting(false);
                                
                            } catch (err) {
                                setStatus({ success:false });
                                setErrors({ submit: err.message})
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                             <form noValidate onSubmit={handleSubmit} {...others}>
                                <Box sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                autoComplete="given-name"
                                                name="firstname"
                                                required
                                                fullWidth
                                                id="firstname"
                                                label="First Name"
                                                onChange={handleChange}
                                                autoFocus
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="lastname"
                                                label="Last Name"
                                                name="lastname"
                                                autoComplete="family-name"
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                                                <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-email-register"
                                                    type="email"
                                                    value={values.email}
                                                    name="email"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    inputProps={{}}
                                                />
                                                {touched.email && errors.email && (
                                                    <FormHelperText error id="standard-weight-helper-text--register">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                        <FormControl
                                            fullWidth
                                            error={Boolean(touched.password && errors.password)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                             <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password-register"
                                                type={showPassword ? 'text' : 'password'}
                                                value={values.password}
                                                name="password"
                                                label="Password"
                                                autoComplete="new-password"
                                                onBlur={handleBlur}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    changePassword(e.target.value);
                                                }}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                            size="large"
                                                        >
                                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                inputProps={{}}
                                            />
                                            {touched.password && errors.password && (
                                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                                    {errors.password}
                                                </FormHelperText>
                                            )}
                                        </FormControl>


                                        {strength !== 0 && (
                                            <FormControl fullWidth>
                                                <Box sx={{ mb: 2 }}>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item>
                                                            <Box
                                                                style={{ backgroundColor: level?.color }}
                                                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                                {level?.label}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </FormControl>
                                        )}
                                        </Grid>

                                        
                                            <Grid item>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={checked}
                                                            onChange={(event) => setChecked(event.target.checked)}
                                                            name="checked"
                                                            color="primary"
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="subtitle1">
                                                            Agree with &nbsp;
                                                            <Typography variant="subtitle1" component={Link} to="#">
                                                                Terms & Condition.
                                                            </Typography>
                                                        </Typography>
                                                    }
                                                />
                                            </Grid>
                                       
                                        {errors.submit && (
                                            <Box sx={{ mt: 3 }}>
                                                <FormHelperText error>{errors.submit}</FormHelperText>
                                            </Box>
                                        )}

                                        {errorMsg && (
                                            <Box sx={{ mt: 3 }}>
                                                <FormHelperText error>{errorMsg}</FormHelperText>
                                            </Box>
                                        )}
                                        
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                sx={{ mt: 3, mb: 2 }}
                                                >
                                                Sign Up
                                            </Button>
                                        </Grid>
                                        <Grid container justifyContent="flex-end">
                                        <Grid item>
                                            <Link href="/login" variant="body2">
                                            Already have an account? Sign in
                                            </Link>
                                        </Grid>
                                        </Grid>

                                    </Grid>
                                </Box>
                             </form>         
                        )
                        }
                    </Formik>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}
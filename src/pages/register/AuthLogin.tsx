import React, {useState} from 'react';

// material-ui
import {
    Button,
    Checkbox,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel, Link,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import {
    authLogin, authRegister,
    FetchError,
} from "../../restapi";
import {useUser} from "../../restapi";
import {useDispatch} from "react-redux";
import {overviewRoute} from "../../routes";
import Router from "next/router";

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
    const { mutateUser } = useUser({})


    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const [showApikey_zerynth, setApikey_zerynth] = React.useState(false);
    const handleClickShowApikey_zerynth = () => {
        setApikey_zerynth(true);
    };

    const handleMouseDownPassword = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
    };
    const handleMouseDownApikey_zerynth = () => {
        setApikey_zerynth(false);
    };

    const dispatch = useDispatch();

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    name: '',
                    surname: '',
                    apikey_zerynth: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required'),
                    name: Yup.string().max(255).required('Name is required'),
                    surname: Yup.string().max(255).required('Surname is required'),
                    apikey_zerynth: Yup.string().max(255).required('Apikey Zerynth is required'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        setStatus({ success: true });
                        setSubmitting(true);
                        mutateUser(
                            await authRegister(values.email, values.password,values.name, values.surname,values.apikey_zerynth),
                            false,
                        )
                        Router.push(overviewRoute.url)
                    } catch (error) {
                        if (error instanceof FetchError) {
                            setStatus({ success: false });
                            // @ts-ignore
                            setErrors({ submit: error.data.message });
                            setSubmitting(false);
                        } else {
                            console.error('An unexpected error happened:', error)
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-login">Email Address</InputLabel>
                                    <OutlinedInput
                                        id="email-login"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        fullWidth
                                        error={Boolean(touched.email && errors.email)}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-login">Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="-password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter password"
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-login">Name</InputLabel>
                                    <OutlinedInput
                                        id="name"
                                        type="name"
                                        value={values.name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter name"
                                        fullWidth
                                        error={Boolean(touched.name && errors.name)}
                                    />
                                    {touched.name && errors.name && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.name}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-login">Surname</InputLabel>
                                    <OutlinedInput
                                        id="surname"
                                        type="surname"
                                        value={values.surname}
                                        name="surname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter surname"
                                        fullWidth
                                        error={Boolean(touched.surname && errors.surname)}
                                    />
                                    {touched.surname && errors.surname && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.surname}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                                        <InputLabel htmlFor="email-login">Apikey zerynth</InputLabel>
                                        <Typography component={Link} href="https://cloud.zerynth.com/" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                                            Sign In Here
                                        </Typography>
                                    </Stack>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.apikey_zerynth && errors.apikey_zerynth)}
                                        id="apikey_zerynth"
                                        type={showApikey_zerynth ? 'text' : 'password'}
                                        value={values.apikey_zerynth}
                                        name="apikey_zerynth"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowApikey_zerynth}
                                                    onMouseDown={handleMouseDownApikey_zerynth}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showApikey_zerynth ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter password"
                                    />
                                    {touched.apikey_zerynth && errors.apikey_zerynth && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.apikey_zerynth}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Sign In
                                </Button>
{/*                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Login
                                    </Button>
                                </AnimateButton>*/}
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthLogin;
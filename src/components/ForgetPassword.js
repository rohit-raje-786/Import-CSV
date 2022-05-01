import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { account } from "../utils/config";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { useEffect, useState } from "react";

const theme = createTheme();

function ForgotPassword() {
  const [err, setErr] = useState();
  let navigate = useNavigate();
  let urlSearchParams = new URLSearchParams(window.location.search);
  let secret = urlSearchParams.get("secret");
  let userId = urlSearchParams.get("userId");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await account.createRecovery(
        data.get("email"),
        "http://localhost:3000/passwordrecovery"
      );
      setErr("Email Send Succesfully");
      console.log("Email Send Succesfully");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Send Email
              </Button>
              {err ? <Alert severity="success">{err}</Alert> : <></>}
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default ForgotPassword;

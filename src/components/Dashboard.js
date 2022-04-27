import { Alert, Button, Container } from "@mui/material";
import React, { useState, useEffect } from "react";
import { createWorker } from "tesseract.js";

import account from "../utils/config";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const pages = ["Home", "Logout", "Delete My Account"];

function Dashboard() {
  const [userDetails, setUserDetails] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState(null);
  const [msg, setMessage] = useState("Extract");
  const [isCopied, setIsCopied] = useState(false);
  const [err, setErr] = useState("");
  let navigate = useNavigate();

  const worker = createWorker({
    logger: (m) => console.log(m),
  });

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await account.get();
        console.log(res);
        setUserDetails(res);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    try {
      await account.deleteSession("current");
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const deleteAccount = async (e) => {
    e.preventDefault();
    try {
      await account.delete();
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const fileChange = (e) => {
    setErr("");
    console.log(e.target.files[0].type.split("/")[0]);
    if (e.target.files[0].type.split("/")[0] != "image") {
      setErr("Only Image files are supported");
    } else {
      setErr("no");
      setSelectedFile(e.target.files[0]);
    }
  };

  const fileUpload = async () => {
    try {
      setMessage("Extracting...");
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
        data: { text },
      } = await worker.recognize(selectedFile);
      setText(text);
      console.log(text);
      await worker.terminate();
      setMessage("Extract");
    } catch (e) {
      console.log(e);
    }
  };

  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(text)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const textChange = (e) => {
    e.preventDefault();
    if (e.target.value.length != 0) {
      setText(e.target.value);
    }
  };
  return (
    <div>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              <img
                src={require("../img.png")}
                style={{ width: "70px", height: "60px" }}
              />
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button
                onClick={() => navigate(`/`)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Home
              </Button>
              <Button
                onClick={logout}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Logout
              </Button>
              <Button
                onClick={deleteAccount}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Delete My Account
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {userDetails ? (
        <div>
          <br />
          <br />
          <Container>
            <div style={{ textAlign: "center" }}>
              <input type="file" onChange={fileChange} className="inputfile" />
            </div>
            <br />
            {err.length > 0 && err != "no" ? (
              <Alert severity="error">{err}</Alert>
            ) : (
              <></>
            )}
            <br />
            {err == "no" ? (
              <Button variant="contained" onClick={fileUpload}>
                {msg}
              </Button>
            ) : (
              <></>
            )}

            <br />
            <br />
            {text ? (
              <textarea rows="19" cols="100" onChange={textChange}>
                {text}
              </textarea>
            ) : (
              <></>
            )}

            <br />
            <br />
            <div
              style={{
                display: "flex",
                flexDirection: "column",

                alignItems: "center",
              }}
            >
              {text ? (
                <>
                  <Button variant="contained" onClick={handleCopyClick}>
                    {isCopied ? "Copied" : "Copy to ClipBoard"}
                  </Button>
                  <br />
                  <Button variant="contained" onClick={() => setText("")}>
                    Clear
                  </Button>
                </>
              ) : (
                <></>
              )}
              <br />
            </div>
          </Container>
        </div>
      ) : (
        <h2>Please Login In first</h2>
      )}
    </div>
  );
}

export default Dashboard;

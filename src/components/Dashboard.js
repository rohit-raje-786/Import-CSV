import { Alert, Button, Container } from "@mui/material";
import React, { useState, useEffect } from "react";
import { createWorker } from "tesseract.js";

import { account, database } from "../utils/config";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { ExcelRenderer } from "react-excel-renderer";

function Dashboard() {
  const [userDetails, setUserDetails] = useState("");

  const [msg, setMessage] = useState("Import to Appwrite DB");

  const [err, setErr] = useState("");
  const [rows, setRows] = useState([[]]);
  const [cols, setCols] = useState([]);
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
      navigate("/signin");
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
    ExcelRenderer(e.target.files[0], (err, resp) => {
      if (err) {
        setErr(err);
      } else {
        let col = resp.rows[0];
        let rows = resp.rows;
        col.splice(0, 1);
        setCols(col);
        for (let i = 1; i < rows.length; i++) {
          rows[i].splice(0, 1);
        }
        rows.splice(0, 1);
        setRows(rows);
        setErr("no");
      }
    });
  };

  const fileUpload = async (e) => {
    e.preventDefault();
    setMessage("Importing...");
    for (let i = 0; i < rows.length; i++) {
      let data = {};
      for (let j = 0; j < rows[i].length; j++) {
        data[cols[j].toLowerCase().replace(" ", "")] = rows[i][j];
      }

      await database
        .createDocument(
          process.env.REACT_APP_COLLECTION_ID,
          "unique()",
          data,
          ["role:all"],
          [`user:${process.env.REACT_APP_USER_ID}`]
        )
        .then((res) => {
          console.log(res);
          setMessage("Imported");
        })
        .catch((e) => console.log(e));
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
              <h2>CSV Import</h2>
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
            <br />
            {cols.length > 0 && rows.length > 0 && (
              <table className="styled-table">
                <thead>
                  <tr>
                    {cols.map((c, i) => (
                      <th key={i}>{c}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      {r.map((d, j) => (
                        <td key={j}>{d}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
          </Container>
        </div>
      ) : (
        <h2>Please Login In first</h2>
      )}
    </div>
  );
}

export default Dashboard;

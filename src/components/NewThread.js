// reference: https://stackblitz.com/edit/react-tag-input-1nelrc?file=index.js
import { React, setState, useEffect, useState, useRef, Fragment } from "react";
import { Form, Card, Button, } from "react-bootstrap"
import axios from "axios";
import { Redirect } from "react-router";

import 'semantic-ui-css/semantic.min.css';
import { Select, Container, Input } from 'semantic-ui-react';
import "./NewThread.css"
import { WithContext as ReactTags } from 'react-tag-input';
import { FroalaEditor } from "./FloaraEditor";

const FormThread = () => {
    const [isRedirect, setIsRedirect] = useState(0);
    const [tags, setTags] = useState({ data: [], suggestion: [] });
    const [categories, setCategories] = useState([]);
    var listCategory = [];
    const title = useRef();
    const [editor, setEditor] = useState("");
    const [select,setSelect] = useState("");
    const [suggestions, setSuggest] = useState([])
    const [gotoThread, setGotoThread] = useState("1")

    const handleEditor = (e) => {
        //console.log(e)
        setEditor(e);
    }

    function difference(setA, setB) {
        let _difference = new Set(setA)
        for (let elem of setB) {
            _difference.delete(elem)
        }
        return _difference
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const listTag = tags.data.map((item, index) => {
            return item.text;
        });
        const setA = new Set(tags.suggestion.map((item) => {
            return item.text;
        }));
        const setB = new Set(tags.data.map((item) => {
            return item.text;
        }))

        let newTagList = Array.from(difference(setB, setA)).map((item) => {
            return {
                tagName: item
            }
        });
        //console.log(editor);

        let res = await axios.post(`http://localhost:9999/api/threads/`, {
            title: title.current.inputRef.current.value,
            content: editor,
            category: (select !== "" || select !== undefined) ? select : null,
            tags: listTag,
            newTag: newTagList
        }, {
            headers: {
                'x-access-token': localStorage.getItem('x-access-token')
            }
        });
        if (res.data.code === 1) {
            setGotoThread(res.data.id);
            setIsRedirect(true);
        } else {
            alert("error:" + JSON.stringify(res.data.msg));
        }

    }

    const handleSelect = (e, data) => {
        setSelect(data.value);
    }

    const KeyCodes = {
        comma: 188,
        enter: 13
    };
    const delimiters = [KeyCodes.comma, KeyCodes.enter];


    const handleDelete = (i) => {
        const { data } = tags;
        setTags({
            data: data.filter((tag, index) => index !== i), suggestion: suggestions
        })
    }

    const handleAddition = (tag) => {
        setTags({ data: [...tags.data, tag], suggestion: suggestions })
    }

    const handleDrag = (tag, currPos, newPos) => {
        const tags1 = [...tags.data];
        const newTags = tags1.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        // re-render
        setTags({ data: newTags, suggestion: suggestions });
    }



    useEffect(() => {
        Promise.all([
            axios.get(`http://localhost:9999/api/categories`),
            axios.get(`http://localhost:9999/api/tags`),
        ])
            .then(([categories, tagsData]) => {
                categories.data.map((item, index) => {
                    listCategory.push({
                        key: item._id,
                        value: item._id,
                        text: item.category
                    });
                });
                setCategories(listCategory);

                setSuggest(tagsData.data.map((item, index) => {
                    return {
                        id: item._id,
                        text: item.tagName
                    }
                }))
                setTags({ data: [], suggestion: suggestions })
            })
            .catch();
    }, [])

    return (
        isRedirect && gotoThread !== "1" ? <Redirect to={"/forum/thread/" + gotoThread} /> :
            <Fragment>
                <Container>
                    <Card className="new-thread">
                        <Input placeholder="Title" ref={title}></Input>
                        <ReactTags
                            tags={tags.data}
                            suggestions={tags.suggestion}
                            delimiters={delimiters}
                            handleDelete={handleDelete}
                            handleAddition={handleAddition}
                            handleDrag={handleDrag}
                            inputFieldPosition="inline"
                            autocomplete
                            autofocus={true}
                            maxLength={15}
                        />

                        <Select required search placeholder='Select your category'
                            options={categories} onChange={handleSelect} />
                        <FroalaEditor stateUp={handleEditor} />
                        <Form onSubmit={handleSubmit}>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Card>
                </Container>
            </Fragment>
    );
}

export default FormThread;
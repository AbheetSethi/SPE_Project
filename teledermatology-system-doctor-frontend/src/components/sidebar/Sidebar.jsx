import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, ListItem, ListItemText } from '@material-ui/core';
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

const Sidebar = () => {
    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleListItemClick = (index) => {
        setSelectedIndex(index);
    };

    const items = [
        {
            id: 1,
            title: 'Item 1',
            content: 'This is the content for Item 1.',
        },
        {
            id: 2,
            title: 'Item 2',
            content: 'This is the content for Item 2.',
        },
        {
            id: 3,
            title: 'Item 3',
            content: 'This is the content for Item 3.',
        },
    ];

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <List>
                    {items.map((item, index) => (
                        <ListItem
                            button
                            key={item.id}
                            selected={selectedIndex === index}
                            onClick={() => handleListItemClick(index)}
                        >
                            <ListItemText primary={item.title} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                {selectedIndex !== null && (
                    <div>
                        <h2>{items[selectedIndex].title}</h2>
                        <p>{items[selectedIndex].content}</p>
                    </div>
                )}
            </main>
        </div>
    );
};
export default Sidebar;


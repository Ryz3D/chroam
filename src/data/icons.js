import React from "react";
import * as mui from "@mui/material";
import {
    AddLinkRounded,
    BookmarkAddRounded,
    BookmarkRounded,
    BorderColor,
    CalendarMonthRounded,
    History,
    LinkRounded,
    TodayRounded,
} from "@mui/icons-material";

class Icons {
    static topic = { default: LinkRounded, new: AddLinkRounded };
    static mention = { default: BookmarkRounded, new: BookmarkAddRounded };
    static daily = { default: TodayRounded, new: CalendarMonthRounded };
    static highlight = { default: BorderColor };
    static history = { default: History };

    static create(icon, options = {
        startIcon: false,
        endIcon: false,
        secondary: false,
        style: {},
        props: {},
    }) {
        return React.createElement(icon, {
            style: {
                marginRight: options.startIcon ? '10px' : undefined,
                marginLeft: options.endIcon ? '10px' : undefined,
                color: options.secondary ? '#aaa' : undefined,
                ...options.style,
            },
            ...options.props,
        });
    }
}

export default Icons;

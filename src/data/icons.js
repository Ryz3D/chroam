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
    }) {
        return React.createElement(icon, {
            style: {
                marginRight: options.startIcon ? '10px' : '',
                marginLeft: options.endIcon ? '10px' : '',
            },
        });
    }
}

export default Icons;

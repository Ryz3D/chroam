import React from 'react';
import * as mui from '@mui/material';
import routerNavigate from '../wrapper/routerNavigate';
import BasicUIComponent from '../components/basicUI';
import BigHeaderComponent from '../components/bigHeader';
import muiTheme from '../wrapper/muiTheme';
import { Brush, Check, Clear, FormatColorReset, InvertColors, TouchApp } from '@mui/icons-material';

class NotesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasWidth: 200,
            canvasHeight: 200,
            lines: JSON.parse(localStorage.getItem('chroamNotes') || '[]'),
            tool: 0,
            pressure: true,
            color: 0,
        };

        this.boxRef = React.createRef();
        this.canvasRef = React.createRef();

        this.moveThreshold = 2;
        this.scaleFactor = 1.5;
        this.colors = ['#000', '#1de9b6', '#f00'];
        this.darkColors = ['#000'];
        this.brushColor = this.colors[0];
        this.brushRadius = 1;
        this.eraseRadius = 15;
        this.clearStart = [0, 0];
        this.clearEnd = [0, 0];
    }

    canvasRender() {
        if (this.canvasRef.current) {
            const ctx = this.canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            for (var l of this.state.lines) {
                for (var i = 0; i < l.length - 1; i++) {
                    const p = l[i + 1];
                    ctx.lineWidth = p[2];
                    ctx.strokeStyle = p[3];
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(l[i][0], l[i][1]);
                    ctx.lineTo(p[0], p[1]);
                    ctx.stroke();
                }
            }
        }
    }

    componentDidMount() {
        document.body.style = {
            overflow: 'hidden',
            position: 'fixed',
        };
        this.scrollPreventer = e => { e.preventDefault(); return false; };
        document.body.addEventListener('touchmove', this.scrollPreventer, { passive: false });

        this.windowHandler = () => {
            if (this.boxRef.current) {
                this.setState({
                    canvasWidth: this.boxRef.current.clientWidth * this.scaleFactor,
                    canvasHeight: this.boxRef.current.clientHeight * this.scaleFactor,
                }, () => this.canvasRender());
            }
        };
        window.addEventListener('resize', this.windowHandler);
        this.windowHandler();
    }

    componentWillUnmount() {
        document.body.removeEventListener('touchmove', this.scrollPreventer);
        window.removeEventListener('resize', this.windowHandler);
    }

    clearAll() {
        this.setState({ lines: [] });

        if (this.canvasRef.current) {
            const ctx = this.canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    }

    lineStart(x, y) {
        x *= this.scaleFactor;
        y *= this.scaleFactor;

        this.isDrawing = true;
        if (this.state.tool === 0) {
            this.setState({
                lines: [
                    ...this.state.lines.filter(l => l.length > 0),
                    [[Math.round(x), Math.round(y)], [Math.round(x), Math.round(y) + 1, this.brushRadius, this.brushColor]],
                ],
            }, () => this.lineMove(x, y));
        }
        else if (this.state.tool === 2) {
            this.clearStart = [x, y];
            if (this.canvasRef.current)
                this.clearData = this.canvasRef.current.toDataURL();
        }
    }
    lineMove(x, y) {
        x *= this.scaleFactor;
        y *= this.scaleFactor;

        if (!this.isDrawing)
            return;

        if (this.state.tool === 0) {
            if (this.state.lines.length === 0)
                return;

            const l = this.state.lines[this.state.lines.length - 1];
            if (l.length === 0)
                return;

            const dx = x - l[l.length - 1][0];
            const dy = y - l[l.length - 1][1];

            if (Math.sqrt(dx * dx + dy * dy) > this.moveThreshold || l.length === 2) {
                this.setState({
                    lines: [
                        ...this.state.lines.slice(0, -1),
                        [...l, [Math.round(x), Math.round(y), this.brushRadius, this.brushColor]],
                    ],
                });

                if (this.canvasRef.current) {
                    const ctx = this.canvasRef.current.getContext('2d');
                    ctx.lineWidth = this.brushRadius;
                    ctx.strokeStyle = this.brushColor;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(l[l.length - 1][0], l[l.length - 1][1]);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
        }
        else if (this.state.tool === 1) {
            if (this.state.lines.length === 0)
                return;

            const newLines = [];
            for (var l of this.state.lines) {
                newLines.push([]);
                for (var p of l) {
                    const dx = p[0] - x;
                    const dy = p[1] - y;
                    if (Math.sqrt(dx * dx + dy * dy) < this.eraseRadius)
                        newLines.push([]);
                    newLines[newLines.length - 1].push([...p]);
                }
            }
            this.setState({
                lines: newLines.filter(l => l.length > 1),
            });
            if (this.canvasRef.current) {
                const ctx = this.canvasRef.current.getContext('2d');
                ctx.save();
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(x, y, this.eraseRadius, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#000';
                ctx.fill();
                ctx.restore();
            }
        }
        else if (this.state.tool === 2) {
            this.clearEnd = [x, y];
            if (this.canvasRef.current) {
                const ctx = this.canvasRef.current.getContext('2d');
                const img = new Image();
                img.src = this.clearData;
                img.onload = () => {
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    ctx.drawImage(img, 0, 0);
                    ctx.fillStyle = '#1de9b640';
                    ctx.fillRect(...this.clearStart, x - this.clearStart[0], y - this.clearStart[1]);
                };
            }
        }
    }
    lineEnd() {
        this.isDrawing = false;

        var newLines = this.state.lines;
        if (this.state.tool === 2) {
            const x1 = Math.min(this.clearStart[0], this.clearEnd[0]);
            const x2 = Math.max(this.clearStart[0], this.clearEnd[0]);
            const y1 = Math.min(this.clearStart[1], this.clearEnd[1]);
            const y2 = Math.max(this.clearStart[1], this.clearEnd[1]);

            if (this.canvasRef.current) {
                const ctx = this.canvasRef.current.getContext('2d');
                const img = new Image();
                img.src = this.clearData;
                img.onload = () => {
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    ctx.drawImage(img, 0, 0);
                    ctx.clearRect(x1, y1, x2 - x1, y2 - y1);
                };
            }

            newLines = [];
            for (var l of this.state.lines) {
                newLines.push([]);
                for (var p of l) {
                    if (p[0] >= x1 && p[0] <= x2 && p[1] >= y1 && p[1] <= y2)
                        newLines.push([]);
                    newLines[newLines.length - 1].push([...p]);
                }
            }
        }
        this.setState({
            lines: newLines.filter(l => l.length > 1),
        }, () => localStorage.setItem('chroamNotes', JSON.stringify(this.state.lines)));
    }

    touchStart(e) {
        e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;

        const t = [...e.targetTouches].reverse()[0];
        const f1 = t.force === undefined ? Math.min(15, Math.max(1, t.radiusY / 10)) : (1 + 14 * t.force);
        const f2 = t.force === undefined ? Math.min(60, Math.max(10, t.radiusY / 2)) : (10 + 50 * t.force);
        this.brushRadius = this.state.pressure ? f1 : 1;
        this.eraseRadius = this.state.pressure ? f2 : 15;

        const rect = this.boxRef.current.getBoundingClientRect();
        this.lineStart(t.clientX - rect.x, t.clientY - rect.y);
        return false;
    }
    touchMove(e) {
        e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;

        const t = [...e.targetTouches].reverse()[0];
        const f1 = t.force === undefined ? Math.min(15, Math.max(1, t.radiusY / 10)) : (1 + 14 * t.force);
        const f2 = t.force === undefined ? Math.min(60, Math.max(10, t.radiusY / 2)) : (10 + 50 * t.force);
        this.brushRadius = this.state.pressure ? f1 : 1;
        this.eraseRadius = this.state.pressure ? f2 : 15;

        const rect = this.boxRef.current.getBoundingClientRect();
        this.lineMove(t.clientX - rect.x, t.clientY - rect.y);
        return false;
    }
    touchEnd() {
        this.lineEnd();
        return false;
    }

    mouseStart(e) {
        e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;

        const rect = this.boxRef.current.getBoundingClientRect();
        this.lineStart(e.clientX - rect.x, e.clientY - rect.y);
        return false;
    }
    mouseMove(e) {
        e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;

        if (e.buttons === 0)
            this.isDrawing = false;
        else if (!this.isDrawing)
            this.mouseStart(e);
        const rect = this.boxRef.current.getBoundingClientRect();
        this.lineMove(e.clientX - rect.x, e.clientY - rect.y);
        return false;
    }
    mouseEnd() {
        this.lineEnd();
        return false;
    }

    render() {
        const noSelectStyle = {
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            MsUserSelect: 'none',
            OUserSelect: 'none',
            userSelect: 'none',
        };
        const canvasStyle = {
            backgroundColor: '#ddd',
            width: '100%',
            height: 'calc(100vh - 200px)',
            borderRadius: '10px',
            ...noSelectStyle,
        };
        const actualCanvasStyle = {
            width: '100%',
            height: '100%',
            ...noSelectStyle,
        };

        return (
            <BasicUIComponent
                setDark={this.props.setDark}
                setPage={(u) => this.setPage(u)}
                clearAll={() => this.clearAll()}
                export={() => ({ url: this.canvasRef.current.toDataURL(), name: 'chroamNotes' })}>
                <BigHeaderComponent
                    header='Notes' noSelect
                    end={
                        <div style={{ display: 'flex' }}>
                            {this.colors.map((c, i) =>
                                <mui.IconButton key={i} style={{
                                    marginRight: '10px',
                                    backgroundColor: c,
                                }} onClick={() => { this.brushColor = c; this.setState({ tool: 0, color: i }); }}>
                                    {this.state.color === i ?
                                        <Check color={this.darkColors.includes(c) ? 'primary' : '#000'} />
                                        :
                                        <InvertColors color={this.darkColors.includes(c) ? 'primary' : '#000'} />
                                    }
                                </mui.IconButton>
                            )}
                            <mui.IconButton color={this.state.tool === 0 ? 'primary' : undefined}
                                onClick={() => this.setState({ tool: 0 })}>
                                <Brush />
                            </mui.IconButton>
                            <mui.IconButton color={this.state.tool === 1 ? 'primary' : undefined}
                                onClick={() => this.setState({ tool: 1 })}>
                                <FormatColorReset />
                            </mui.IconButton>
                            <mui.IconButton color={this.state.tool === 2 ? 'primary' : undefined}
                                onClick={() => this.setState({ tool: 2 })}>
                                <Clear />
                            </mui.IconButton>
                            <mui.IconButton color={this.state.pressure ? 'primary' : undefined}
                                onClick={() => this.setState({ pressure: !this.state.pressure })}>
                                <TouchApp />
                            </mui.IconButton>
                        </div>
                    }
                />

                <div ref={this.boxRef} style={canvasStyle}
                    onTouchStart={e => this.touchStart(e)} onTouchMove={e => this.touchMove(e)} onTouchEnd={() => this.touchEnd()}
                    onMouseDown={e => this.mouseStart(e)} onMouseMove={e => this.mouseMove(e)} onMouseUp={() => this.mouseEnd()} onMouseOut={() => this.mouseEnd()}>
                    <canvas ref={this.canvasRef} style={actualCanvasStyle}
                        width={this.state.canvasWidth}
                        height={this.state.canvasHeight} />
                </div>
            </BasicUIComponent>
        );
    }
}

export default routerNavigate(muiTheme(NotesPage));

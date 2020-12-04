/**
 * Copyright (C) 2020 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
import { Remarkable } from 'remarkable';
import md, {matchImage, getSearchString} from './utils';

test('Image markup match', () => {
    let imageString = '![foobar](http=whatever){width=640 height=480}';
    expect(matchImage(imageString)[1]).toBe('foobar');
    expect(matchImage(imageString)[2]).toBe('http=whatever');
    expect(matchImage(imageString)[4]).toBe('width=640 height=480');
    imageString = '![foobar](http=whatever){width=640   height=480}';
    expect(matchImage(imageString)[4]).toBe('width=640   height=480');
    imageString = '![](http=whatever){width=640 height=480}';
    expect(matchImage(imageString)[1]).toBe('');
});

test('Image markup match, no width/height', () => {
    let imageString = '![foobar](http=whatever)';
    expect(matchImage(imageString)[2]).toBe('http=whatever');
    expect(matchImage(imageString)[3]).toBeUndefined();
});

test('Image markup match, invalid width/height', () => {
    let imageString = '![foobar](http=whatever){width=a height=b}';
    expect(matchImage(imageString)[2]).toBe('http=whatever');
    expect(matchImage(imageString)[3]).toBeUndefined();
});

test('Image markup conversion', () => {
    let remarkable = new Remarkable('full', {
        html:         false,        // Enable HTML tags in source
        xhtmlOut:     false,        // Use '/' to close single tags (<br />)
        breaks:       false,        // Convert '\n' in paragraphs into <br>
        langPrefix:   'language-',  // CSS language prefix for fenced blocks
        linkTarget:   '',           // set target to open link in
        // Enable some language-neutral replacements + quotes beautification
        typographer:  false,
      
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
        quotes: '“”‘’',
    
      });
    remarkable.use(md);
    let imageString = '![foobar](https://www.istockphoto.com/foto/temple-in-reflection-gm480556950-68802047){width=640 height=480}';
    expect(remarkable.render(imageString)).toBe('<img src="https://www.istockphoto.com/foto/temple-in-reflection-gm480556950-68802047" alt="foobar" width=640 height=480>');
    imageString = '![foobar](http=whatever)';
    expect(remarkable.render(imageString)).toBe('<img src="http=whatever" alt="foobar">');
    imageString = '![](http=whatever)';
    expect(remarkable.render(imageString)).toBe('<img src="http=whatever">');
});

test('getSearchString owner', () => {
    let searchCriteria = {owner: "owner"};
    expect(getSearchString(searchCriteria)).toContain('owner=owner');
});

test('getSearchString title', () => {
    let searchCriteria = {title: "title"};
    expect(getSearchString(searchCriteria)).toContain('title=title');
});

test('getSearchString text', () => {
    let searchCriteria = {text: "text"};
    expect(getSearchString(searchCriteria)).toContain('desc=text');
});

test('getSearchString level', () => {
    let searchCriteria = {level: "level"};
    expect(getSearchString(searchCriteria)).toContain('level=level');
});

test('getSearchString logbooks', () => {
    let searchCriteria = {logbooks: ["logbook1", "logbook2"]};
    expect(getSearchString(searchCriteria)).toContain('logbooks=logbook1,logbook2');
});

test('getSearchString tags', () => {
    let searchCriteria = {tags: ["tag1", "tag2"]};
    expect(getSearchString(searchCriteria)).toContain('tags=tag1,tag2');
});

test('getSearchString default time tange', () => {
    let searchCriteria = {};
    expect(getSearchString(searchCriteria)).toContain('start=');
    expect(getSearchString(searchCriteria)).toContain('end=');
});

test('getSearchString time tange', () => {
    let searchCriteria = {startDate: 0, endDate: 0};
    expect(getSearchString(searchCriteria)).toContain('start=1970-01-01');
    expect(getSearchString(searchCriteria)).toContain('end=1970-01-01');
});

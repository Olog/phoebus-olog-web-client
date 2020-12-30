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
import {getSearchString} from './utils';

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

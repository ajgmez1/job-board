import React, { useContext } from 'react';
import { JobsContext } from '../../context/JobsContext';

const Sidebar = ({map, group, section, centerMap, asideControl}) => {
    const { jobs } = useContext(JobsContext);
    const j = jobs.filter((j) => map && map.getBounds().contains(L.latLng(j.lat, j.lng)));

    const onClick = (markerData) => {
        let markers = group.getLayers(),
            marker = markers.find((m) => m.options.id === markerData.id);

        if (marker) {
            if (section.hidden) {
                asideControl(() => {
                    map.invalidateSize();
                    centerAndOpenPopup(marker);
                });
            } else {
                centerAndOpenPopup(marker);
            }
        }
    };

    const centerAndOpenPopup = (marker) => {
        centerMap(marker.__parent.getBounds(), () => {
            recursiveZoomOrSpiderfy(marker);
        });
    };

    const recursiveZoomOrSpiderfy = (marker) => {
        let parent = marker.__parent,
            group = parent._group;

        if (marker.getElement()) {
            marker.openPopup();
        } else {
            group.once('animationend', () => {
                recursiveZoomOrSpiderfy(marker);
            });
            group._zoomOrSpiderfy({layer: parent});
        }
    };

    return (
        <aside>
            <table>
                <thead>
                    <tr>
                        <th scope="col"> # </th>
                        <th scope="col"> Position </th>
                        <th scope="col"> Location </th>
                    </tr>
                </thead>
                <tbody>
                    {j.map((m, i) => (
                        <tr key={m.id} onClick={() => onClick(m)} className={`${m.selected ? 'jb-selected' : ''}`}>
                            <th scope="row"> {i+1} </th>
                            <td> {m.title} </td>
                            <td> {m.location} </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </aside>
    );
};

export default Sidebar;



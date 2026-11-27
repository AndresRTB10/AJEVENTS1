package com.event_management.event_management_system_backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Profile("prod")
public class DatabaseStartupDiagnostic {

    private static final Logger log = LoggerFactory.getLogger(DatabaseStartupDiagnostic.class);
    private final JdbcTemplate jdbc;

    public DatabaseStartupDiagnostic(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void reportDatabase() {
        try {
            jdbc.query("SELECT DATABASE() AS database_name, COUNT(*) AS event_count FROM event",
                    (org.springframework.jdbc.core.RowCallbackHandler) result -> log.info("AJEVENTS_DB_DIAGNOSTIC database={} event_count={}",
                            result.getString("database_name"), result.getLong("event_count")));
        } catch (DataAccessException failure) {
            log.warn("AJEVENTS_DB_DIAGNOSTIC query_failed={}", failure.getClass().getSimpleName());
        }
    }
}
